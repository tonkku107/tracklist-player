import AudioFileIcon from '@mui/icons-material/AudioFile';
import { Button } from '@mui/material';
import { useId, useRef, useState } from 'react';

export default function FileInput({ onFiles }) {
  const id = useId();
  const ref = useRef();
  const [loading, setLoading] = useState(false);

  const onChange = async e => {
    if (e.target.files.length) {
      setLoading(true);
      await onFiles(e.target.files);
      ref.current.value = null;
      setLoading(false);
    }
  };

  return (
    <>
      <input id={`${id}-file`} ref={ref} type="file" hidden multiple accept="audio/*" onChange={onChange} />
      <Button
        fullWidth
        variant="contained"
        htmlFor={`${id}-file`}
        component="label"
        startIcon={<AudioFileIcon />}
        disabled={loading}
      >
        Load from file
      </Button>
    </>
  );
}
