import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import useStore from './Store';
import { ThemeToggle } from './Theme';

export default function Settings() {
  const [store, dispatch] = useStore();
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton size="large" onClick={() => setOpen(true)}>
        <SettingsIcon />
      </IconButton>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="lg">
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

            <Stack spacing={1}>
              <Typography variant="h5">Player preferences</Typography>

              <Typography variant="h6">Display</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                The font and use of all caps replicate the look on the MSS & COTW streams when they used to have video.
                You can disable them here.
              </Typography>
              <FormGroup>
                <FormControlLabel
                  slotProps={{ typography: { variant: 'mcat_body1' } }}
                  control={
                    <Switch
                      checked={store?.settings?.useFont ?? true}
                      onChange={(_, value) => dispatch({ type: 'SET_USE_FONT', value })}
                    />
                  }
                  label="Use Gotham font"
                />
                <Typography variant="caption" color="text.secondary">
                  You will need the font installed on your system to see it
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={store?.settings?.useCaps ?? true}
                      onChange={(_, value) => dispatch({ type: 'SET_USE_CAPS', value })}
                    />
                  }
                  label="Use all caps for artist and title"
                />
              </FormGroup>

              <Typography variant="h6">Autoplay</Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={store?.settings?.autoplay ?? false}
                      onChange={(_, value) => dispatch({ type: 'SET_AUTOPLAY', value })}
                    />
                  }
                  label="Start playing when player is opened"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={store?.settings?.autoplayNext ?? true}
                      onChange={(_, value) => dispatch({ type: 'SET_AUTOPLAY_NEXT', value })}
                    />
                  }
                  label="Play next mix in queue automatically"
                />
              </FormGroup>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
