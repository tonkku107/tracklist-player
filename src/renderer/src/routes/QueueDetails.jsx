import { Button, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import useStore from '../components/Store';
import TracklistTable from '../components/TracklistTable';
import parseTracklist from '../utils/parseTracklist';

export function Component() {
  const [store, dispatch] = useStore();
  const { id } = useParams();
  const track = store?.queue?.get(id);

  const [editing, setEditing] = useState(!track?.tracklist);
  const [input, setInput] = useState(track?.rawTracklist);
  const [hidden, setHidden] = useState(!track?.tracklistManuallyEdited);

  useEffect(() => {
    setEditing(!track?.tracklist);
    setInput(track?.rawTracklist);
    setHidden(!track?.tracklistManuallyEdited);
  }, [track]);

  const save = useCallback(() => {
    const tracklist = parseTracklist(input);
    dispatch({ type: 'SAVE_TRACKLIST', id, tracklist, raw: input });
    setEditing(false);
    setHidden(false);
  }, [dispatch, id, input]);

  const cancel = useCallback(() => {
    setEditing(false);
    setInput(track.rawTracklist);
  }, [track?.rawTracklist]);

  if (!track) return <></>;

  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <Typography variant="h5">
        {editing ? 'Editing' : 'Previewing'} {track.title ?? track.filename}
      </Typography>
      {editing ? (
        <>
          <Typography variant="h6">Import tracklist</Typography>
          <TextField
            variant="filled"
            label="Tracklist"
            multiline
            minRows={10}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <Stack direction="row" justifyContent="end" spacing={1}>
            {track.tracklist && (
              <Button variant="outlined" onClick={cancel}>
                Cancel
              </Button>
            )}
            <Button variant="outlined" disabled={!input} onClick={save}>
              Save
            </Button>
          </Stack>
        </>
      ) : (
        <>
          <Button variant="outlined" onClick={() => setEditing(true)}>
            Edit
          </Button>
          {hidden ? (
            <Button onClick={() => setHidden(false)} variant="outlined">
              Reveal tracklist
            </Button>
          ) : (
            <TracklistTable tracklist={track.tracklist} />
          )}
        </>
      )}
    </Stack>
  );
}

Component.displayName = 'QueueDetails';
