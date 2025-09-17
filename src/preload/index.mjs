import { electronAPI } from '@electron-toolkit/preload';
import { contextBridge, ipcRenderer } from 'electron';

const api = {
  theme: {
    getTheme: () => ipcRenderer.invoke('theme:get'),
    setTheme: theme => ipcRenderer.invoke('theme:set', theme),
  },
  updates: {
    checkForUpdates: () => ipcRenderer.invoke('updates:check-for-updates'),
    downloadUpdate: () => ipcRenderer.send('updates:download-update'),
    restartAndUpdate: () => ipcRenderer.send('updates:restart-and-update'),
    getAllowPrerelease: () => ipcRenderer.invoke('updates:get-allow-prerelease'),
    setAllowPrerelease: value => ipcRenderer.invoke('updates:set-allow-prerelease', value),
  },
  presence: {
    getSettings: () => ipcRenderer.invoke('presence:get-settings'),
    setSettings: (key, value) => ipcRenderer.invoke('presence:set-settings', key, value),
    setActivity: status => ipcRenderer.send('presence:set-activity', status),
  },
};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
