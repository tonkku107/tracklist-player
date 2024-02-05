import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { useState } from 'react';

export default function DebugInfoDialog({ data }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton size="large" onClick={() => setOpen(true)}>
        <InfoOutlinedIcon fontSize="inherit" />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          Debug Info
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
        </DialogContent>
      </Dialog>
    </>
  );
}
