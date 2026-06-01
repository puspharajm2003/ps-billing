const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'frontend/public/logo.jpg'), // or use an .ico file for Windows
    title: "SMR Groups Billing"
  });

  // Remove default menu for a cleaner look
  Menu.setApplicationMenu(null);

  mainWindow.loadURL('http://localhost:5000');
}

app.whenReady().then(() => {
  // Enforce offline variables for the child process
  const backendEnv = {
    ...process.env,
    VERCEL: '',          // Disable Vercel mode
    USE_NEON: 'false',   // Force SQLite
    PORT: '5000'         // Run on exactly 5000
  };

  // Start the backend process
  const backendPath = path.join(__dirname, 'backend', 'dist', 'index.js');
  backendProcess = spawn('node', [backendPath], { env: backendEnv });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  // Wait a moment for Express to initialize SQLite and bind to port
  setTimeout(() => {
    createWindow();
  }, 2500);

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

app.on('quit', () => {
  // Ensure the backend process is killed when the electron app closes
  if (backendProcess) {
    backendProcess.kill();
  }
});
