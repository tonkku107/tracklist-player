/* global __VERSION__, __REPO__, __COMMIT__ */
import { Box, Link, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileInput from '../components/FileInput';
import RssButton from '../components/RssButton';
import useStore from '../components/Store';
import { ThemeToggle } from '../components/Theme';
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
    <Stack justifyContent="center" alignItems="center" sx={{ height: '100%', position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: '24px', top: '24px' }}>
        <ThemeToggle />
      </Box>

      <Stack justifyContent="center" alignItems="center" spacing={2} sx={{ width: 'fit-content' }}>
        <FileInput onFiles={onFiles} />
        <RssButton />
      </Stack>

      <Box sx={{ position: 'absolute', left: '24px', bottom: '24px' }}>
        <Link href={__REPO__} target="_blank" underline="hover" variant="caption" color="text.primary">
          v{__VERSION__} ({__COMMIT__})
        </Link>
      </Box>
    </Stack>
  );
}

Component.displayName = 'App';
