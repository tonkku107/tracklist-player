import CloseIcon from '@mui/icons-material/Close';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  Box,
  Button,
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
import { useCallback, useEffect, useState } from 'react';
import usePresence from '../utils/usePresence';
import useStore from './Store';
import { ThemeToggle, fontGothamOnly, fontMontserratOnly } from './Theme';

export default function Settings() {
  const [store, dispatch] = useStore();
  const [open, setOpen] = useState(false);
  const [updateCheckStatus, setUpdateCheckStatus] = useState('');
  const [betaState, setBetaState] = useState({ allowPrerelease: false, forcedPrerelease: false });
  const { presenceSettings, setPresenceSettings } = usePresence();

  const checkForUpdates = useCallback(async () => {
    setUpdateCheckStatus('Checking for updates...');
    const result = await window.api.updates.checkForUpdates();
    if (!result) setUpdateCheckStatus("Couldn't check for updates");
  }, []);

  useEffect(() => {
    const ipcRenderer = window.electron?.ipcRenderer;
    if (!ipcRenderer) return;

    const onUpdateAvailable = () => {
      setUpdateCheckStatus('There is a new update!');
    };
    ipcRenderer.on('updates:update-available', onUpdateAvailable);

    const onUpdateNotAvailable = () => {
      setUpdateCheckStatus('You are already up to date');
    };
    ipcRenderer.on('updates:update-not-available', onUpdateNotAvailable);

    return () => {
      ipcRenderer.removeListener('updates:update-available', onUpdateAvailable);
      ipcRenderer.removeListener('updates:update-not-available', onUpdateNotAvailable);
    };
  }, []);

  useEffect(() => {
    window.api?.updates.getAllowPrerelease().then(setBetaState);
  }, []);

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
                  control={
                    <Switch
                      checked={store?.settings?.useFont ?? true}
                      onChange={(_, value) => dispatch({ type: 'SET_USE_FONT', value })}
                    />
                  }
                  label={
                    <Typography>
                      Use{' '}
                      <Typography component="span" sx={{ fontFamily: fontGothamOnly }}>
                        Gotham
                      </Typography>{' '}
                      or{' '}
                      <Typography component="span" sx={{ fontFamily: fontMontserratOnly }}>
                        Montserrat
                      </Typography>{' '}
                      font
                    </Typography>
                  }
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

            {window?.api?.presence && (
              <Stack spacing={1}>
                <Typography variant="h5">Discord Rich Presence</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Display what you're listening to in your discord status
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={presenceSettings.enabled}
                        onChange={(_, value) => setPresenceSettings('enabled', value)}
                      />
                    }
                    label="Enabled"
                  />
                </FormGroup>
              </Stack>
            )}

            {window?.api?.updates && (
              <Stack spacing={1}>
                <Typography variant="h5">Updates</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={betaState.allowPrerelease}
                        onChange={(_, value) => window.api.updates.setAllowPrerelease(value).then(setBetaState)}
                        disabled={betaState.forcedPrerelease}
                      />
                    }
                    label="Opt-in to beta updates"
                  />
                </FormGroup>
                <Box>
                  <Button variant="contained" onClick={checkForUpdates}>
                    Check for updates
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {updateCheckStatus}
                </Typography>
              </Stack>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
