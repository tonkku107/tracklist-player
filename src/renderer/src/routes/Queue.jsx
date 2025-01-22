import { Button, Divider, Stack, Tooltip, Typography } from '@mui/material';
import { useCallback, useEffect, useMemo } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router';
import DraggableItem from '../components/DraggableItem';
import DroppableList from '../components/DroppableList';
import FileInput from '../components/FileInput';
import ListTrack from '../components/ListTrack';
import RssButton from '../components/RssButton';
import useStore from '../components/Store';
import { processFile } from '../utils/processMetadata';

export function Component() {
  const [store, dispatch] = useStore();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!store.queue || store.queue.size === 0) navigate('/');
  }, [store.queue, navigate]);

  const onFiles = useCallback(
    async files => {
      for (const file of files) {
        const track = await processFile(file);
        dispatch({ type: 'ADD_TRACK_TO_QUEUE', track });
      }
    },
    [dispatch]
  );

  const onDragEnd = useCallback(
    result => {
      const { active, over } = result;
      dispatch({ type: 'MOVE_TRACK', from: active.id, to: over.id });
    },
    [dispatch]
  );

  const queueValues = useMemo(() => [...(store?.queue?.values() ?? [])], [store]);
  const queueKeys = useMemo(() => [...(store?.queue?.keys() ?? [])], [store]);
  const canProceed = useMemo(() => queueValues.every(t => !!t.tracklist), [queueValues]);

  return (
    <Stack direction="row" spacing={1} sx={{ minHeight: '100%', p: 1 }}>
      <Stack alignItems="center" sx={{ minWidth: '33%', maxWidth: '33%' }} spacing={1}>
        <Typography variant="h5">Queue</Typography>
        <DroppableList sx={{ width: '100%' }} onDragEnd={onDragEnd} ids={queueKeys}
          renderOverlay={i => (
            <ListTrack
              dragState={{ isOverlay: true }}
              track={store.queue.get(i)}
              selected={id === i}
              onDelete={() => {}}
              onClick={() => {}}
            />
          )}
        >
          {queueValues.map(t => (
            <DraggableItem
              Component={ListTrack}
              key={t.id}
              id={t.id}
              track={t}
              selected={id === t.id}
              onDelete={() => dispatch({ type: 'DELETE_TRACK_FROM_QUEUE', id: t.id })}
              onClick={() => navigate(`/queue/${t.id}`)}
            />
          ))}
        </DroppableList>
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
      <Outlet key={id} />
    </Stack>
  );
}

Component.displayName = 'Queue';
