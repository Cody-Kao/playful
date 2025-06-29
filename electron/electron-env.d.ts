/// <reference types="vite-plugin-electron/electron-env" />

import {
  WindowActionFunc,
  HandlePermission,
  addNewFolderFunc,
  getFoldersFunc,
  getPreFolderFunc,
  getPreSongFunc,
  playSongFunc,
  WindowActionFunc,
  resumePlayFunc,
  handleSwitchSongFunc,
} from "./type";

declare namespace NodeJS {
  interface ProcessEnv {
    /**
     * The built directory structure
     *
     * ```tree
     * ├─┬─┬ dist
     * │ │ └── index.html
     * │ │
     * │ ├─┬ dist-electron
     * │ │ ├── main.js
     * │ │ └── preload.js
     * │
     * ```
     */
    APP_ROOT: string;
    /** /dist/ or /public/ */
    VITE_PUBLIC: string;
  }
}

// Used in Renderer process, expose in `preload.ts` and wrap it with `declare global `
declare global {
  interface Window {
    context: {
      /* resizeWindow: (width: number) => void;
      backToSize: () => void; */
      windowActionFunc: WindowActionFunc;
      addNewFolder: addNewFolderFunc;
      getFolders: getFoldersFunc;
      getPreFolder: getPreFolderFunc;
      getPreSong: getPreSongFunc;
      playSong: playSongFunc;
      resumePlay: resumePlayFunc;
      handleSwitchSong: handleSwitchSongFunc;
    };
  }
}
