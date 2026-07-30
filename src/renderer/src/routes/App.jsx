/* global __VERSION__, __REPO__, __COMMIT__ */
import { Box, Link, Stack } from '@mui/material';
import { useNavigate } from 'react-router';
import FileInput from '../components/FileInput';
import RssButton from '../components/RssButton';
import Settings from '../components/Settings';
import useStore from '../components/Store';
import { processFile } from '../utils/processMetadata';

export function Component() {
  const [, dispatch] = useStore();
  const navigate = useNavigate();

  const onFiles = async files => {
    for (const file of files) {
      const track = await processFile(file);
      dispatch({ type: 'ADD_TRACK_TO_QUEUE', track });
    }
    navigate('/queue');
  };

  return (
    <Stack sx={{ height: '100%', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ position: 'absolute', right: '24px', top: '24px' }}>
        <Settings />
      </Box>

      <Stack spacing={2} sx={{ width: 'fit-content', justifyContent: 'center', alignItems: 'center' }}>
        <FileInput onFiles={onFiles} />
        <RssButton />
      </Stack>

      <Box sx={{ position: 'absolute', left: '24px', bottom: '24px' }}>
        <Link href={__REPO__} target="_blank" underline="hover" variant="caption" sx={{ color: 'text.primary' }}>
          v{__VERSION__} ({__COMMIT__})
        </Link>
      </Box>
    </Stack>
  );
}

Component.displayName = 'App';
