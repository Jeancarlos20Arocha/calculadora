const { app, BrowserWindow } = require("electron");
const path = require("path");

const obtenido = app.requestSingleInstanceLock();
if (!obtenido) {
  app.quit();
} else {
  function crearVentana() {
    const ventana = new BrowserWindow({
      width: 420,
      height: 680,
      resizable: false,
      maximizable: false,
      show: false,
      icon: path.join(__dirname, "public", "icono.png"),
      backgroundColor: "#0f172a",
      webPreferences: {
        contextIsolation: true,
        nodeIntegration: false
      }
    });

    ventana.setMenuBarVisibility(false);

    ventana.once("ready-to-show", () => {
      ventana.show();
    });

    ventana.loadFile(path.join(__dirname, "public", "index.html"));
  }

  app.on("second-instance", () => {
    const ventana = BrowserWindow.getAllWindows()[0];
    if (ventana) {
      if (ventana.isMinimized()) ventana.restore();
      ventana.focus();
    }
  });

  app.whenReady().then(() => {
    crearVentana();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) crearVentana();
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
}