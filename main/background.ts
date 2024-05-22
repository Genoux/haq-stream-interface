import path from 'path';
import { app, ipcMain, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
}

let mainWindow: BrowserWindow | null;

(async () => {
  const Store = (await import('electron-store')).default;
  const store = new Store();

  await app.whenReady();

  mainWindow = createWindow('main', {
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.center();

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on('window-all-closed', () => {
  app.quit();
});

ipcMain.on('close-window', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    window.close();
  }
});

ipcMain.on('open-draft-window', (event, roomParams) => {
  const draftWindow = new BrowserWindow({
    width: 1344,
    height: 756,
    minWidth: 1344,
    minHeight: 756,
    maxWidth: 1920, // maxWidth to prevent resizing
    maxHeight: 1080, // Add maxHeight and
    x: 0,
    y: 0,
    roundedCorners: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = isProd 
    ? `app://./draft?${roomParams}` 
    : `http://localhost:${process.argv[2]}/draft?${roomParams}`;

  draftWindow.loadURL(url);
  draftWindow.webContents.openDevTools();
});
