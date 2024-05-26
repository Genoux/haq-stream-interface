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

//   mainWindow.on('minimize', (event: { preventDefault: () => void; }) => {
//     event.preventDefault();
//     mainWindow.hide();  // Hides the window to tray instead of minimizing
// });

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
    width: 1536,
    height: 864 + 28,
    minWidth: 1536,
    minHeight: 864 + 28,
    maxWidth: 1920, // maxWidth to prevent resizing
    maxHeight: 1080, // Add maxHeight and
    x: 0,
    y: 0,
    roundedCorners: false,
    thickFrame:false,
    //frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
