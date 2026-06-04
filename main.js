const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

// Determine if running from a packaged app or in development
const isPackaged = app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: isPackaged
      ? path.join(process.resourcesPath, 'app.asar.unpacked', 'frontend', 'public', 'logo.jpg')
      : path.join(__dirname, 'frontend', 'public', 'logo.jpg'),
    title: "SMR Groups Billing",
    show: false // Don't show until ready
  });

  // Remove default menu for a cleaner look
  Menu.setApplicationMenu(null);

  mainWindow.loadURL('http://localhost:5000');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(async () => {
  // Set environment variables BEFORE requiring the backend
  process.env.ELECTRON = '1';
  process.env.VERCEL = '';
  process.env.USE_NEON = 'false';
  process.env.PORT = '5000';

  try {
    // Require the compiled backend — this runs inside Electron's Node.js runtime,
    // so there is no dependency on the user having Node.js installed.
    const backend = require('./backend/dist/index.js');

    // Start the Express server and wait for it to be ready
    const server = await backend.startServer('5000');
    console.log('Backend server is ready. Opening window...');

    createWindow();
  } catch (err) {
    console.error('Failed to start backend server:', err);
    // Show an error dialog to the user
    const { dialog } = require('electron');
    dialog.showErrorBox(
      'Startup Error',
      `The application failed to start.\n\n${err.message}\n\nPlease try reinstalling the application.`
    );
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
