/* global __REPO__ */
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Button, Collapse, IconButton, LinearProgress, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

const ActionButton = ({ children, ...rest }) => (
  <Button color="inherit" size="small" sx={{ mr: 1 }} {...rest}>
    {children}
  </Button>
);

export default function UpdateBar() {
  const [state, setState] = useState({ open: false });

  useEffect(() => {
    const ipcRenderer = window.electron?.ipcRenderer;
    if (!ipcRenderer) return;

    const onUpdateAvailable = (_, info) => {
      setState(s => ({ ...s, status: 0, open: true, info }));
    };
    ipcRenderer.on('updates:update-available', onUpdateAvailable);

    const onDownloadProgress = (_, progress) => {
      setState(s => ({ ...s, status: 1, progress }));
    };
    ipcRenderer.on('updates:download-progress', onDownloadProgress);

    const onDownloaded = () => {
      setState(s => ({ ...s, status: 2 }));
    };
    ipcRenderer.on('updates:update-downloaded', onDownloaded);

    const onError = () => {
      setState(s => ({ ...s, status: 3 }));
    };
    ipcRenderer.on('updates:update-error', onError);

    return () => {
      ipcRenderer.removeListener('updates:update-available', onUpdateAvailable);
      ipcRenderer.removeListener('updates:download-progress', onDownloadProgress);
      ipcRenderer.removeListener('updates:update-downloaded', onDownloaded);
      ipcRenderer.removeListener('updates:update-error', onError);
    };
  }, []);

  const downloadUpdate = useCallback(() => {
    window.api.updates.downloadUpdate();
    setState(s => ({ ...s, status: 1 }));
  }, []);

  const restartAndUpdate = useCallback(() => {
    window.api.updates.restartAndUpdate();
  }, []);

  return (
    <Collapse in={state.open}>
      <Alert
        severity={state.status === 2 ? 'success' : state.status === 3 ? 'error' : 'info'}
        action={
          <>
            {state.status === 0 ? (
              <ActionButton href={`${__REPO__}/releases/tag/${state.info.tag}`} target="_blank">
                What&apos;s new
              </ActionButton>
            ) : undefined}
            {state.status === 0 ? <ActionButton onClick={downloadUpdate}>Download</ActionButton> : undefined}
            {state.status === 2 ? <ActionButton onClick={restartAndUpdate}>Restart now</ActionButton> : undefined}
            {state.status !== 1 ? (
              <IconButton
                color="inherit"
                size="small"
                onClick={() => {
                  setState(s => ({ ...s, open: false }));
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            ) : undefined}
          </>
        }
        sx={{ '& .MuiAlert-message': { width: state.status === 1 ? '100%' : undefined } }}
      >
        {state.status === 0 ? (
          <Typography>
            There is an update to version <b>{state.info.version}</b>
          </Typography>
        ) : state.status === 1 ? (
          <>
            <Typography>Downloading update</Typography>
            <LinearProgress
              variant={state.progress ? 'determinate' : 'indeterminate'}
              value={state.progress?.percent ?? 0}
            />
          </>
        ) : state.status === 2 ? (
          <Typography>Update downloaded! It will be installed when you close the application.</Typography>
        ) : (
          <Typography>An error occurred while updating.</Typography>
        )}
      </Alert>
    </Collapse>
  );
}
