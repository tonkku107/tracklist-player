// import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  theme: {
    getTheme: () => ipcRenderer.invoke('theme:get'),
    setTheme: theme => ipcRenderer.invoke('theme:set', theme),
  },
  downloadUpdate: () => ipcRenderer.send('download-update'),
};

if (process.contextIsolated) {
  try {
    // contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  // window.electron = electronAPI;
  window.api = api;
}
