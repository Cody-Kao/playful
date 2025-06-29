import { Folder, Song, Response } from "../src/Types/types";

export type WindowActions = "MINIMIZE" | "CLOSE";

export type WindowActionFunc = (action: WindowActions) => void;

export type TokenResponse = {
  status: "success" | "error";
  statusMsg: string;
  accessToken: string;
  refreshToken: string;
};
export type HandlePermission = () => Promise<TokenResponse>;

export type getFoldersFunc = () => Promise<Folder[]>;
export type getPreFolderFunc = () => Promise<Folder | null>;
export type getPreSongFunc = () => Promise<Song | null>;
export type addNewFolderFunc = () => Promise<Response | null>;
export type playSongFunc = (
  folderPath: string,
  songPath?: string,
) => Promise<Response>;
export type resumePlayFunc = (songPath: string) => Promise<boolean>;
export type switchSongFunc = (
  folderPath: string,
  songPath: string,
) => Promise<Response>;
export type handleSwitchSongFunc = (
  folderPath: string,
  songPath: string,
  flag: number,
  isRandom: boolean,
) => Promise<Response>;
