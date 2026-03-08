export type Settings = {
  folders: Folder[];
  previous_folder: Folder;
  previous_song: Song;
};

export type Song = {
  songPath: string;
  img: string;
};

export type Folder = {
  folderPath: string;
  folderImg: string;
};

export type Response = {
  status: "success" | "error";
  msg: string;
  payload?: any;
};

export type SlideDir = "Left" | "Right" | "Up" | "Down";

/* export type LyricsResponse = {
  lyrics: string;
  error: string;
}; */

export type SyncedLyricsData = {
  seconds: number;
  lyrics: string;
};
export type FullLyricsData = {
  albumName: string;
  artistName: string;
  trackName: string;
  duration: number;
  plainLyrics: string;
  syncedLyrics: string;
};
export type LyricsResponse = {
  fullLyricsData: FullLyricsData | null;
  error: string;
};
