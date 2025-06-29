import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { Folder, Song } from "../Types/types";

type playerContextType = {
  curSong: Song | null;
  setCurSong: React.Dispatch<React.SetStateAction<Song | null>>;
  resetSongAndFolder: () => void;
  reloadFolders: () => void;
  curFolder: Folder | null;
  setCurFolder: React.Dispatch<React.SetStateAction<Folder | null>>;
  folders: Folder[];
};

const playerContext = createContext<playerContextType | undefined>(undefined);

export const usePlayerContext = () => {
  const context = useContext(playerContext);
  if (!context)
    throw new Error(
      "usePlayerContext must be used within PlayerContextProvider",
    );
  return context;
};

export default function PlayerContextProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const [curSong, setCurSong] = useState<Song | null>(null);
  const [curFolder, setCurFolder] = useState<Folder | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const reloadFolders = async () => {
    const folders = await window.context.getFolders();
    setFolders(folders);
  };
  const resetSongAndFolder = () => {
    setCurSong(null);
    setCurFolder(null);
  };
  useEffect(() => {
    const loadFolder = async () => {
      const folder = await window.context.getPreFolder();
      setCurFolder(folder);
    };
    const loadSong = async () => {
      const song = await window.context.getPreSong();
      setCurSong(song);
    };
    reloadFolders();
    loadFolder();
    loadSong();
  }, []);

  return (
    <playerContext.Provider
      value={{
        curSong,
        setCurSong,
        curFolder,
        setCurFolder,
        resetSongAndFolder,
        folders,
        reloadFolders,
      }}
    >
      {children}
    </playerContext.Provider>
  );
}
