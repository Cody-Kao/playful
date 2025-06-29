import {
  existsSync,
  writeFileSync,
  readdirSync,
  readFileSync,
  statSync,
} from "fs";
import { dialog } from "electron";
import { defaultSettings, encoding, settingsPath } from "./consts";
import { Folder, Settings, Song, Response } from "../src/Types/types";
import path, { extname } from "path";
import { extractSongName, generateRandomNumber } from "../src/Utils/utils";
import {
  addNewFolderFunc,
  getFoldersFunc,
  getPreFolderFunc,
  getPreSongFunc,
  playSongFunc,
  resumePlayFunc,
  switchSongFunc,
} from "./type";

// 初始化settings.json
const initSettings = async (): Promise<boolean> => {
  try {
    const exist = existsSync(settingsPath);
    if (!exist) {
      writeFileSync(
        settingsPath,
        JSON.stringify(defaultSettings, null, 2), // Pretty-print with 2-space indentation
        { encoding: encoding },
      );
    }
  } catch (error) {
    console.log("error when init settings.json", error);
    return false;
  }
  return true;
};

// 讀取檔案內容
const readFileGeneric = async <T>(filePath: string): Promise<T | null> => {
  try {
    const content = readFileSync(filePath, { encoding: encoding });
    const settings = JSON.parse(content) as T;
    return settings;
  } catch (error) {
    console.log("error when read settings", error);
    return null;
  }
};
// 找出images資料夾中的第一個圖片位址
const getFirstImagePath = async (folderPath: string): Promise<string> => {
  try {
    const files = readdirSync(folderPath);
    if (files.length === 0) return ""; // no files in image folder

    const imageFiles = files
      .filter((file) => {
        const ext = extname(file).toLowerCase();
        return ext === ".jpg";
      })
      .map((file) => {
        const filePath = path.join(folderPath, file);
        const stats = statSync(filePath);
        return {
          name: file,
          path: filePath,
          birthtime: stats.birthtime,
        };
      });
    if (imageFiles.length === 0) return ""; // no image files(.jpg)
    return imageFiles.sort(
      (a, b) => a.birthtime.getTime() - b.birthtime.getTime(),
    )[0].path;
  } catch (error) {
    console.log("error when get first image", error);
    return "";
  }
};
// 找出歌單資料夾中的第一首歌曲位址
const getFirstSongPath = async (folderPath: string): Promise<string> => {
  try {
    const files = readdirSync(folderPath);
    if (files.length === 0) return ""; // no files in song folder

    const imageFiles = files
      .filter((file) => {
        const ext = extname(file).toLowerCase();
        return ext === ".mp3";
      })
      .map((file) => {
        const filePath = path.join(folderPath, file);
        const stats = statSync(filePath);
        return {
          name: file,
          path: filePath,
          birthtime: stats.birthtime,
        };
      });
    if (imageFiles.length === 0) return ""; // no audio files(.mp3)
    return imageFiles.sort(
      (a, b) => a.birthtime.getTime() - b.birthtime.getTime(),
    )[0].path;
  } catch (error) {
    console.log("error when get first song", error);
    return "";
  }
};
// 取得所有歌單路徑與資料
export const getFolders: getFoldersFunc = async (): Promise<Folder[]> => {
  const success = await initSettings();
  if (!success) return [];
  const folders: Folder[] = [];
  try {
    const settings = await readFileGeneric<Settings>(settingsPath);
    if (!settings) return [];
    for (const folder of settings.folders) {
      const imageFolderPath = path.join(folder.folderPath, "images");
      if (!existsSync(folder.folderPath) || !existsSync(imageFolderPath))
        continue;
      const image = await getFirstImagePath(imageFolderPath);
      if (!image) continue;
      folders.push({
        folderPath: folder.folderPath,
        folderImg: image,
      });
    }
    writeFileSync(
      settingsPath,
      JSON.stringify({ ...settings, folders }, null, 2),
      { encoding: encoding },
    );
    return folders;
  } catch (error) {
    console.log("error when get folders", error);
    return [];
  }
};
// 從settings.json中獲取之前播放的歌單資料
export const getPreFolder: getPreFolderFunc =
  async (): Promise<Folder | null> => {
    const success = await initSettings();
    if (!success) return null;
    const settings = await readFileGeneric<Settings>(settingsPath);
    if (!settings || !settings.previous_folder) return null;
    try {
      if (
        !existsSync(settings.previous_folder.folderPath) ||
        !existsSync(settings.previous_folder.folderImg)
      ) {
        const newFolders = settings.folders.filter(
          (folder) => folder.folderPath !== settings.previous_folder.folderPath,
        );
        writeFileSync(
          settingsPath,
          JSON.stringify(
            { ...settings, folders: newFolders, previous_folder: null },
            null,
            2,
          ),
          { encoding: encoding },
        );
        return null;
      }
      return settings.previous_folder;
    } catch (error) {
      console.log("error when get previous folder from settings.json", error);
      return null;
    }
  };
// 從settings.json中獲取之前播放的歌曲資料
export const getPreSong: getPreSongFunc = async (): Promise<Song | null> => {
  const success = await initSettings();
  if (!success) return null;
  const settings = await readFileGeneric<Settings>(settingsPath);
  if (!settings || !settings.previous_song) return null;
  try {
    if (!existsSync(settings.previous_song.songPath)) {
      writeFileSync(
        settingsPath,
        JSON.stringify({ ...settings, previous_song: null }, null, 2),
        { encoding: encoding },
      );
      return null;
    }
    if (!existsSync(settings.previous_song.img))
      return { ...settings.previous_song, img: "" };
    return settings.previous_song;
  } catch (error) {
    console.log("error when get previous song from settings.json", error);
    return null;
  }
};
// 新增歌單路徑
export const addNewFolder: addNewFolderFunc =
  async (): Promise<Response | null> => {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "選擇資料夾", // Optional: Dialog title
        buttonLabel: "選擇", // Optional: Custom button text
      });
      if (canceled || filePaths.length === 0) return null;
      const folderPath = filePaths[0];
      console.log("add new folder from", folderPath);
      if (!existsSync(folderPath))
        return {
          status: "error",
          msg: "指定路徑資料夾不存在",
        };
      // 查看是否有.mp3檔案
      const files = readdirSync(folderPath);
      const audioFiles = files.filter((file) => {
        const ext = extname(file).toLowerCase();
        return ext === ".mp3";
      });
      if (files.length === 0 || audioFiles.length === 0)
        return {
          status: "error",
          msg: "路徑資料夾無mp3檔案",
        };

      const imageFolder = path.join(folderPath, "images");
      if (!existsSync(imageFolder))
        return {
          status: "error",
          msg: "路徑缺少images資料夾",
        };
      const settings = await readFileGeneric<Settings>(settingsPath);
      const imagePath = await getFirstImagePath(imageFolder);
      if (imagePath === "")
        return {
          status: "error",
          msg: "images資料夾不得為空",
        };
      if (!settings)
        return {
          status: "error",
          msg: "settings.json不存在",
        };
      settings.folders.unshift({
        folderPath: folderPath,
        folderImg: imagePath,
      });
      const newSettings: Settings = {
        ...settings,
        folders: settings.folders,
      };
      writeFileSync(settingsPath, JSON.stringify(newSettings, null, 2), {
        encoding: encoding,
      });
    } catch (error) {
      console.log("error when add a new folder path");
    }

    return { status: "success", msg: "路經添加成功" };
  };
// 取得歌曲.mp3檔案資料
/* const getSongInfo = async (songPath: string): Promise<number | null> => {
  try {
    const metadata = await parseStream(createReadStream(songPath), {
      mimeType: "audio/mpeg",
    });
    return metadata.format.duration ?? null; // Duration in seconds
  } catch (error) {
    console.error("Error reading metadata:", error);
    return null;
  }
}; */
// 播放歌曲/歌單
export const playSong: playSongFunc = async (
  folderPath: string,
  songPath?: string,
): Promise<Response> => {
  try {
    if (!existsSync(folderPath))
      return {
        status: "error",
        msg: "歌曲資料夾不存在",
      };
    const folderImg = await getFirstImagePath(folderPath);
    const firstSongPath = await getFirstSongPath(folderPath);
    if (!firstSongPath)
      return {
        status: "error",
        msg: "歌曲資料夾不得為空",
      };

    // 解構出歌名 並找出對應的圖片
    if (!songPath) {
      const name = extractSongName(firstSongPath);
      if (name === "")
        return {
          status: "error",
          msg: "歌曲名稱格式錯誤",
        };
      let songImg = path.join(folderPath, "images", `${name}.jpg`);
      if (!existsSync(songImg)) {
        songImg = "";
      }
      /* const duration = await getSongInfo(firstSongPath);
      if (!duration)
        return {
          status: "error",
          msg: "解析mp3檔案失敗",
        }; */
      return {
        status: "success",
        msg: "播放成功",
        payload: {
          folder: { folderPath, folderImg } as Folder,
          song: {
            songPath: firstSongPath,
            img: songImg,
          } as Song,
        },
      };
    } else {
      const name = extractSongName(songPath);
      if (!existsSync(songPath))
        return {
          status: "error",
          msg: "指定歌曲不存在",
        };

      let songImg = path.join(folderPath, "images", `${name}.jpg`);
      if (!existsSync(songImg)) {
        songImg = "";
      }
      /* const duration = await getSongInfo(songPath);
      if (!duration)
        return {
          status: "error",
          msg: "解析mp3檔案失敗",
        }; */
      return {
        status: "success",
        msg: "播放成功",
        payload: {
          folder: { folderPath, folderImg } as Folder,
          song: {
            songPath: firstSongPath,
            img: songImg,
          } as Song,
        },
      };
    }
  } catch (error) {
    console.log("error when play song", error);
    return {
      status: "error",
      msg: "播放失敗",
    };
  }
};

// resume play
export const resumePlay: resumePlayFunc = (
  songPath: string,
): Promise<boolean> => {
  return new Promise((resolve, _) => resolve(existsSync(songPath)));
};
// next song
export const nextSong: switchSongFunc = async (
  folderPath: string,
  songPath: string,
): Promise<Response> => {
  if (!existsSync(folderPath))
    return {
      status: "error",
      msg: "歌單資料夾不存在",
    };

  try {
    const songs = readdirSync(folderPath)
      .filter((file) => extname(file).toLowerCase() === ".mp3")
      .map((file) => {
        const filePath = path.join(folderPath, file);
        const stats = statSync(filePath);
        return {
          name: file,
          path: filePath,
          birthtime: stats.birthtime,
        };
      })
      .sort((a, b) => a.birthtime.getTime() - b.birthtime.getTime());
    if (songs.length === 0) {
      return {
        status: "error",
        msg: "歌單資料夾為空",
      };
    }
    const songPathArray = Array.from(
      { length: songs.length },
      (_, i) => songs[i].path,
    );
    const curSongIndex = songPathArray.indexOf(songPath);
    let nextSongIndex = curSongIndex + 1;
    if (nextSongIndex >= songPathArray.length) {
      nextSongIndex = 0;
    }
    const songName = extractSongName(songPathArray[nextSongIndex]);
    let songImgPath = path.join(folderPath, "images", `${songName}.jpg`);
    if (!existsSync(songImgPath)) {
      songImgPath = "";
    }

    return {
      status: "success",
      msg: "播放成功",
      payload: {
        songPath: songPathArray[nextSongIndex],
        img: songImgPath,
      } as Song,
    };
  } catch (error) {
    console.log("error when play next song", error);
    return {
      status: "error",
      msg: "播放錯誤",
    };
  }
};
// previous song
export const previousSong: switchSongFunc = async (
  folderPath: string,
  songPath: string,
): Promise<Response> => {
  if (!existsSync(folderPath))
    return {
      status: "error",
      msg: "歌單資料夾不存在",
    };

  try {
    const songs = readdirSync(folderPath)
      .filter((file) => extname(file).toLowerCase() === ".mp3")
      .map((file) => {
        const filePath = path.join(folderPath, file);
        const stats = statSync(filePath);
        return {
          name: file,
          path: filePath,
          birthtime: stats.birthtime,
        };
      })
      .sort((a, b) => a.birthtime.getTime() - b.birthtime.getTime());
    if (songs.length === 0) {
      return {
        status: "error",
        msg: "歌單資料夾為空",
      };
    }
    const songPathArray = Array.from(
      { length: songs.length },
      (_, i) => songs[i].path,
    );
    const curSongIndex = songPathArray.indexOf(songPath);
    let nextSongIndex = curSongIndex - 1;
    if (nextSongIndex < 0) {
      nextSongIndex = songPathArray.length - 1;
    }
    const songName = extractSongName(songPathArray[nextSongIndex]);
    let songImgPath = path.join(folderPath, "images", `${songName}.jpg`);
    if (!existsSync(songImgPath)) {
      songImgPath = "";
    }

    return {
      status: "success",
      msg: "播放成功",
      payload: {
        songPath: songPathArray[nextSongIndex],
        img: songImgPath,
      } as Song,
    };
  } catch (error) {
    console.log("error when play previous song", error);
    return {
      status: "error",
      msg: "播放錯誤",
    };
  }
};
// random song
export const randomSong: switchSongFunc = async (
  folderPath: string,
  songPath: string,
): Promise<Response> => {
  if (!existsSync(folderPath))
    return {
      status: "error",
      msg: "歌單資料夾不存在",
    };

  try {
    const songs = readdirSync(folderPath)
      .filter((file) => extname(file).toLowerCase() === ".mp3")
      .map((file) => {
        const filePath = path.join(folderPath, file);
        const stats = statSync(filePath);
        return {
          name: file,
          path: filePath,
          birthtime: stats.birthtime,
        };
      })
      .sort((a, b) => a.birthtime.getTime() - b.birthtime.getTime());
    if (songs.length === 0) {
      return {
        status: "error",
        msg: "歌單資料夾為空",
      };
    }
    const songPathArray = Array.from(
      { length: songs.length },
      (_, i) => songs[i].path,
    );
    const nextSongIndex = generateRandomNumber(0, songPathArray.length - 1);
    const songName = extractSongName(songPathArray[nextSongIndex]);
    let songImgPath = path.join(folderPath, "images", `${songName}.jpg`);
    if (!existsSync(songImgPath)) {
      songImgPath = "";
    }

    return {
      status: "success",
      msg: "播放成功",
      payload: {
        songPath: songPathArray[nextSongIndex],
        img: songImgPath,
      } as Song,
    };
  } catch (error) {
    console.log("error when play random song", error);
    return {
      status: "error",
      msg: "播放錯誤",
    };
  }
};
//切歌走的統一函數
export const handleSwitchSong = async (
  folderPath: string,
  songPath: string,
  flag: number,
  isRandom: boolean,
): Promise<Response> => {
  if (isRandom) return randomSong(folderPath, songPath);
  switch (flag) {
    case 1:
      return await nextSong(folderPath, songPath);
    case -1:
      return await previousSong(folderPath, songPath);
    default:
      return {
        status: "error",
        msg: "錯誤參數",
      };
  }
};
