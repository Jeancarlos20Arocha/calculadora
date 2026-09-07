const { app, BrowserWindow } = require("electron");
const path = require("path");

function crearVentana() {
  const ventana = new BrowserWindow({
    width: 420,
    height: 680,
    resizable: false,
    maximizable: false,
    icon: path.join(__dirname, "public", "icono.png"),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  ventana.setMenuBarVisibility(false);
  ventana.loadFile(path.join(__dirname, "public", "index.html"));
}

app.whenReady().then(() => {
  crearVentana();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) crearVentana();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});