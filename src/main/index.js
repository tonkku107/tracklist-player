/* globals __REPO__, __COMMIT__, __CONTRIBUTORS__ */
import { is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, Menu, app, ipcMain, nativeTheme, shell } from 'electron';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';
import { join } from 'path';
import icon from '../../resources/icon.png?asset';

const store = new Store();
if (store.has('theme')) {
  nativeTheme.themeSource = store.get('theme');
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#121212' : '#fff',
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false,
    },
  });

  const template = [
    ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    { role: 'help', submenu: [{ role: 'about' }] },
  ];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(details => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }

  // Expose some headers that normally aren't accessible with fetch
  mainWindow.webContents.session.webRequest.onHeadersReceived(
    { urls: ['https://dcs.megaphone.fm/*'] },
    (details, callback) => {
      callback({
        responseHeaders: {
          'Access-Control-Expose-Headers': 'X-Megaphone-Payload, X-Megaphone-Payload-2',
          ...details.responseHeaders,
        },
      });
    }
  );
}

ipcMain.handle('theme:toggle', () => {
  if (nativeTheme.shouldUseDarkColors) {
    nativeTheme.themeSource = 'light';
    store.set('theme', 'light');
  } else {
    nativeTheme.themeSource = 'dark';
    store.set('theme', 'dark');
  }

  return nativeTheme.shouldUseDarkColors;
});

ipcMain.handle('theme:system', () => {
  nativeTheme.themeSource = 'system';
  store.delete('theme');
  return nativeTheme.shouldUseDarkColors;
});

app.whenReady().then(() => {
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

const version = `v${app.getVersion()} (${__COMMIT__})`;
app.setAboutPanelOptions({
  applicationName: app.getName(),
  applicationVersion: version,
  version,
  credits: __CONTRIBUTORS__.join(', '),
  authors: __CONTRIBUTORS__,
  website: __REPO__,
  iconPath: icon,
});
