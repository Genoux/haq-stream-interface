import path from 'path';
import { app, ipcMain, BrowserWindow, Tray } from 'electron';
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
let tray: Tray | null;

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

//get the client aream menu bare height as a variable

ipcMain.on('open-draft-window', (event, roomID) => {

  const draftWindow = new BrowserWindow({
    title: `Aram Draft Pick - Room View`,
    //width: 1536,
  //  height: 864 + 28,
    //minWidth: 1536,
    // minHeight: 864 + 28,
    width: 1920*0.8,
    height: 1080 * 0.8,
    minWidth: 1920*0.8,
    minHeight: 1080 * 0.8,
    maxWidth: 1920* 0.8, // maxWidth to prevent resizing
    maxHeight: 1080* 0.8, // Add maxHeight and
    x: 0,
    y: 0,
    roundedCorners: false,
    thickFrame:false,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const url = isProd 
    ? `app://./draft?${roomID}` 
    : `http://localhost:${process.argv[2]}/draft?${roomID}`;

  draftWindow.loadURL(url);
  draftWindow.webContents.openDevTools();
});
