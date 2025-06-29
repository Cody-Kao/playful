import { LyricsResponse } from "../Types/types";

export const formatTimestampStart = (timestamp: number): string => {
  const hours = Math.floor(timestamp / 3600);
  if (hours > 0) return "00:00:00";
  const minutes = Math.floor(timestamp / 60);
  if (minutes > 0) return "00:00";
  return "0:00";
};

export const formatTimestamp = (timestamp: number): string => {
  const hours = Math.floor(timestamp / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);
  const seconds = Math.floor(timestamp % 60); // Add Math.floor here

  // Format with leading zeros
  const pad = (num: number) => num.toString().padStart(2, "0");

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  } else {
    return `${pad(minutes)}:${pad(seconds)}`;
  }
};

export const extractSongName = (songPath: string) => {
  // 1. Normalize path separators to '/'
  const normalizedPath = songPath.replace(/\\/g, "/");

  // 2. Extract the filename (last part after '/')
  const filename = normalizedPath.split("/").pop() || "";

  // 3. Remove file extension (if any)
  const filenameWithoutExt = filename.includes(".")
    ? filename.split(".").slice(0, -1).join(".")
    : filename;

  // 4. Extract the first word (split by the first occurrence of dash)
  const firstWord = filenameWithoutExt.split(/-(.*)/s)[0];

  return firstWord || ""; // Fallback to empty string
};

export const extractArtistName = (songPath: string) => {
  // 1. Normalize path separators to '/'
  const normalizedPath = songPath.replace(/\\/g, "/");

  // 2. Extract the filename (last part after '/')
  const filename = normalizedPath.split("/").pop() || "";

  // 3. Remove file extension (if any)
  const filenameWithoutExt = filename.includes(".")
    ? filename.split(".").slice(0, -1).join(".")
    : filename;

  // 4. Extract the second word (split by the first occurrence of dash)
  const artistName = filenameWithoutExt.split(/-(.*)/s)[1];

  return artistName || ""; // Fallback to empty string
};

export const displayNotice = (body: string) => {
  new window.Notification("Playful通知", { body: body });
};

// The min and max are inclusive
export const generateRandomNumber = (min: number, max: number): number => {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
};

/* export const getLyrics = async (songPath: string): Promise<LyricsResponse> => {
  try {
    const artist = extractArtistName(songPath);
    const songName = extractSongName(songPath);
    const res = await fetch(
      `https://private-anon-a1957196ef-lyricsovh.apiary-proxy.com/v1/${artist}/${songName}`,
    );
    if (res.status > 300) {
      throw new Error("連線失敗");
    }

    const data = await res.json();
    if (typeof data !== "object" || data === null) {
      throw new Error("錯誤格式");
    }
    if ("error" in data) {
      throw new Error(data.error);
    }
    return data as LyricsResponse;
  } catch (error) {
    if (error instanceof Error) {
      return {
        lyrics: "",
        error: error.message,
      };
    }
    return {
      lyrics: "",
      error: "獲取歌詞出現未知錯誤",
    };
  }
}; */

export const getLyrics = async (songPath: string): Promise<LyricsResponse> => {
  try {
    const artist = extractArtistName(songPath);
    const songName = extractSongName(songPath);
    const res = await fetch(
      `http://localhost:3001/lyrics?q=${artist}%20${songName}`,
    );
    if (!res.ok) throw new Error("連線失敗");
    const data = await res.json();
    if (typeof data === "string") throw new Error("查無歌詞");
    return {
      syncedLyrics: data,
      error: "",
    } as LyricsResponse;
  } catch (error) {
    if (error instanceof Error) {
      return {
        syncedLyrics: [],
        error: error.message,
      };
    }
    return {
      syncedLyrics: [],
      error: "獲取歌詞出現未知錯誤",
    };
  }
};
