import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import express from "express";
import axios from "axios";
import https from "https";
import { optimizer } from "@electron-toolkit/utils";
import {
  addNewFolderFunc,
  getFoldersFunc,
  getPreFolderFunc,
  getPreSongFunc,
  playSongFunc,
  resumePlayFunc,
  WindowActionFunc,
  WindowActions,
  handleSwitchSongFunc,
} from "./type";
import {
  addNewFolder,
  getFolders,
  getPreFolder,
  getPreSong,
  handleSwitchSong,
  playSong,
  resumePlay,
} from "./lib";
import { ArtistTrackSeparator } from "../src/Const/const";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let mainWindow: BrowserWindow | null;
function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
      contextIsolation: true,
      plugins: true, // Required for Widevine
      webSecurity: false,
      allowRunningInsecureContent: true,
    },
    width: 400,
    height: 600,
    frame: false,
    resizable: false,
    autoHideMenuBar: true,
    center: true,
    backgroundMaterial: "acrylic", // on Windows 11
    title: "Playful",
    vibrancy: "under-window", // or 'sidebar', 'ultra-dark', etc.
    visualEffectState: "active",
    titleBarStyle: "hiddenInset", // usually better with vibrancy
  });

  // Test active push message to Renderer-process.
  mainWindow.webContents.on("did-finish-load", () => {
    mainWindow?.webContents.send(
      "main-process-message",
      new Date().toLocaleString(),
    );
  });

  if (VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    mainWindow.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    mainWindow = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("ready", async () => {
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  createWindow();
  // 視窗行為
  ipcMain.on("windowActionFunc", (_, ...args: Parameters<WindowActionFunc>) =>
    handleWindowAction(...args),
  );

  // 歌曲行為
  ipcMain.handle("getFolders", (_, ...args: Parameters<getFoldersFunc>) =>
    getFolders(...args),
  );
  ipcMain.handle("getPreFolder", (_, ...args: Parameters<getPreFolderFunc>) =>
    getPreFolder(...args),
  );
  ipcMain.handle("getPreSong", (_, ...args: Parameters<getPreSongFunc>) =>
    getPreSong(...args),
  );
  ipcMain.handle("addNewFolder", (_, ...args: Parameters<addNewFolderFunc>) =>
    addNewFolder(...args),
  );
  ipcMain.handle("playSong", (_, ...args: Parameters<playSongFunc>) =>
    playSong(...args),
  );
  ipcMain.handle("resumePlay", (_, ...args: Parameters<resumePlayFunc>) =>
    resumePlay(...args),
  );
  ipcMain.handle(
    "handleSwitchSong",
    (_, ...args: Parameters<handleSwitchSongFunc>) => handleSwitchSong(...args),
  );
  startServer();
});

const handleWindowAction: WindowActionFunc = (action: WindowActions) => {
  switch (action) {
    case "MINIMIZE":
      mainWindow?.minimize();
      break;
    case "CLOSE":
      mainWindow?.close();
      break;
    default:
      return;
  }
};

export const startServer = () => {
  const app = express();

  app.get("/lyrics", async (req, res) => {
    try {
      const query = req.query.q;
      if (typeof query !== "string") {
        res.status(400).json({ error: "Invalid query" });
        return;
      }
      // make http request with TLS work
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // WARNING: only use this in development!
      });
      const [artistName, trackName] = query.split(ArtistTrackSeparator);
      const response = await axios.get(
        `https://lrclib.net/api/get?artist_name=${artistName}&track_name=${trackName}`,
        //`https://api.textyl.co/api/lyrics?q=${encodeURIComponent(query)}`,
        {
          httpsAgent,
        },
      );

      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch lyrics" });
    }
  });

  app.listen(3001, () => console.log("Proxy running on http://localhost:3001"));
};
