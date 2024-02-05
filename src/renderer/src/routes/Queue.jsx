import { Button, Divider, List, Stack, Tooltip, Typography } from '@mui/material';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import FileInput from '../components/FileInput';
import ListTrack from '../components/ListTrack';
import RssButton from '../components/RssButton';
import useStore from '../components/Store';
import { processFile } from '../utils/processMetadata';

export function Component() {
  const [store, dispatch] = useStore();
  const navigate = useNavigate();
  const { index } = useParams();

  useEffect(() => {
    if (!store.queue || store.queue.length === 0) navigate('/');
  }, [store.queue, navigate]);

  const onFiles = async files => {
    for (const file of files) {
      const track = await processFile(file);
      dispatch({ type: 'ADD_TRACK_TO_QUEUE', track });
    }
  };

  const canProceed = store?.queue?.every?.(t => !!t.tracklist);

  return (
    <Stack direction="row" spacing={1} sx={{ height: '100%', p: 1 }}>
      <Stack alignItems="center" sx={{ minWidth: '33%', maxWidth: '33%' }} spacing={1}>
        <Typography variant="h5">Queue</Typography>
        <List sx={{ width: '100%' }}>
          {store.queue?.map((t, i) => (
            <ListTrack
              key={t.filename}
              track={t}
              selected={index == i}
              onDelete={() => dispatch({ type: 'DELETE_TRACK_FROM_QUEUE', track: t })}
              onClick={() => navigate(`/queue/${i}`)}
            />
          ))}
        </List>
        <Stack justifyContent="center" alignItems="center" spacing={2} sx={{ width: 'fit-content' }}>
          <FileInput onFiles={onFiles} />
          <RssButton />
          <Tooltip title={!canProceed && 'All entries need to have a tracklist'}>
            <span style={{ width: '100%' }}>
              <Button
                fullWidth
                variant="contained"
                color="success"
                disabled={!canProceed}
                onClick={() => navigate('/player')}
              >
                Continue to player
              </Button>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
      <Divider orientation="vertical" flexItem />
      <Outlet key={index} />
    </Stack>
  );
}

Component.displayName = 'Queue';
