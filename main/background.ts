import path from 'path';
import { app, ipcMain, BrowserWindow, shell } from 'electron';
import serve from 'electron-serve';
import { createWindow } from './helpers';

const isProd = process.env.NODE_ENV === 'production';
console.log("isProd:", isProd);

if (isProd) {
  serve({ directory: 'app' });
  require('dotenv').config({ path: path.join(__dirname, '.env.production') });
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`);
  require('dotenv').config({ path: path.join(__dirname, '.env.development') });
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

  mainWindow.on('minimize', (event) => {
    event.preventDefault();
    mainWindow.setBounds({ width: 1, height: 1, x: 0, y: 0 });
  });

  // Restore window size when the app is restored
  mainWindow.on('restore', () => {
    mainWindow.setBounds({ width: 800, height: 600, x: 0, y: 0 });
  });

  mainWindow.center();

  if (isProd) {
    await mainWindow.loadURL('app://./home');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on('open-external-link', (event, url) => {
    console.log("ipcMain.on - url:", url);
    shell.openExternal(url);
  });

})();

app.on('window-all-closed', () => {
  app.quit();
});
