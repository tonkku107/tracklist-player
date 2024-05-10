import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import { Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import { ThemeToggle } from './Theme';

export default function Settings() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton size="large" onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>
          Settings
          <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={1} divider={<Divider flexItem />}>
            <Stack spacing={1}>
              <Typography variant="h5">Theme</Typography>
              <ThemeToggle />
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
