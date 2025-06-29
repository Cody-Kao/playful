import { contextBridge, ipcRenderer } from "electron";
import {
  addNewFolderFunc,
  getFoldersFunc,
  getPreFolderFunc,
  getPreSongFunc,
  playSongFunc,
  handleSwitchSongFunc,
  resumePlayFunc,
  WindowActionFunc,
} from "./type";

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld("context", {
  /* resizeWindow: (width: number) => ipcRenderer.send("resize-window", width),
  backToSize: () => ipcRenderer.send("backToSize"), */
  windowActionFunc: (...args: Parameters<WindowActionFunc>) =>
    ipcRenderer.send("windowActionFunc", ...args),
  getFolders: (...args: Parameters<getFoldersFunc>) =>
    ipcRenderer.invoke("getFolders", ...args),
  getPreFolder: (...args: Parameters<getPreFolderFunc>) =>
    ipcRenderer.invoke("getPreFolder", ...args),
  getPreSong: (...args: Parameters<getPreSongFunc>) =>
    ipcRenderer.invoke("getPreSong", ...args),
  addNewFolder: (...args: Parameters<addNewFolderFunc>) =>
    ipcRenderer.invoke("addNewFolder", ...args),
  playSong: (...args: Parameters<playSongFunc>) =>
    ipcRenderer.invoke("playSong", ...args),
  resumePlay: (...args: Parameters<resumePlayFunc>) =>
    ipcRenderer.invoke("resumePlay", ...args),
  handleSwitchSong: (...args: Parameters<handleSwitchSongFunc>) =>
    ipcRenderer.invoke("handleSwitchSong", ...args),
});
