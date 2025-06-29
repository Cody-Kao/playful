import { app } from "electron";
import path from "path";

export const encoding = "utf-8";
export const defaultSettings = {
  folders: [],
  previous_song: null,
  previous_folder: null,
};

export const settingsPath = path.join(app.getPath("appData"), "settings.json");
