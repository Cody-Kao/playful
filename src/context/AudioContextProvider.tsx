import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePlayerContext } from "./PlayerContextProvider";
import { displayNotice } from "../Utils/utils";
import { SlideDir } from "../Types/types";

type audioContextProviderTypes = {
  currentTime: number;
  volume: number;
  changeVolume: (v: number) => void;
  duration: number;
  isPlaying: boolean;
  togglePlay: () => void;
  isRandom: boolean;
  toggleRandom: () => void;
  seekTo: (time: number) => void;
  isRepeat: boolean;
  toggleRepeat: () => void;
  nextSong: () => void;
  previousSong: () => void;
  slideDir: SlideDir;
};

const audioContext = createContext<audioContextProviderTypes | undefined>(
  undefined,
);

export const useAudioContext = () => {
  const context = useContext(audioContext);
  if (!context)
    throw new Error("useAudioContext must be used within AudioContextProvider");
  return context;
};

export default function AudioContextProvider({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const { curSong, setCurSong, curFolder, resetSongAndFolder, reloadFolders } =
    usePlayerContext();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(50);
  const [duration, setDuration] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [slideDir, setSlideDir] = useState<SlideDir>("Right");
  const changeVolume = (v: number) => {
    if (!audioRef.current || !curSong) return;
    audioRef.current.volume = v / 100;
    setVolume(v);
  };
  const togglePlay = async () => {
    if (!audioRef.current || !curSong) return;
    if (audioRef.current.paused) {
      const successful = await window.context.resumePlay(curSong.songPath);
      if (!successful) {
        resetSongAndFolder();
        displayNotice("播放錯誤 歌曲路徑不存在");
        return;
      }
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  const toggleRandom = () => {
    setIsRandom((prev) => !prev);
  };
  const seekTo = (time: number) => {
    if (audioRef.current && curSong) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };
  const toggleRepeat = () => {
    if (!audioRef.current || !curSong) return;
    setIsRepeat((prev) => !prev);
  };
  const handleSwitchSong = async (
    folderPath: string,
    songPath: string,
    flag: number,
    isRandom: boolean,
  ) => {
    const response = await window.context.handleSwitchSong(
      folderPath,
      songPath,
      flag,
      isRandom,
    );
    if (response.status === "error") {
      reloadFolders();
      resetSongAndFolder();
      displayNotice(response.msg);
      return;
    }
    setCurSong(response.payload);
    setSlideDir(flag === 1 ? "Right" : "Left");
  };
  const nextSong = () => {
    if (!audioRef.current || !curFolder || !curSong) return;
    handleSwitchSong(curFolder.folderPath, curSong.songPath, 1, isRandom);
  };
  const previousSong = () => {
    if (!audioRef.current || !curFolder || !curSong) return;
    if (audioRef.current.currentTime >= 5) {
      audioRef.current.currentTime = 0;
      return;
    }
    handleSwitchSong(curFolder.folderPath, curSong.songPath, -1, isRandom);
  };

  const handleEnd = () => {
    if (!audioRef.current || !curFolder || !curSong) return;

    if (isRepeat) {
      audioRef.current.currentTime = 0; // Reset position
      audioRef.current
        .play()
        .catch((e) => console.error("Repeat play failed:", e));
      return;
    }
    nextSong();
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnd);
    audio.addEventListener("pause", () => setIsPlaying(false));
    audio.addEventListener("play", () => setIsPlaying(true));
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      // When a new src is set / <audio> initially rendered with src / Changing src to the same URL
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      // 自動播放結束
      audio.removeEventListener("ended", handleEnd);
    };
  }, [handleEnd]); // 防止套用到舊的handleEnd
  return (
    <audioContext.Provider
      value={{
        currentTime,
        volume,
        changeVolume,
        duration,
        isPlaying,
        isRandom,
        togglePlay,
        toggleRandom,
        seekTo,
        isRepeat,
        toggleRepeat,
        nextSong,
        previousSong,
        slideDir,
      }}
    >
      <audio
        className="absolute top-0 left-0 h-0 w-0 opacity-0"
        ref={audioRef}
        src={curSong?.songPath || ""}
        controls
        autoPlay
        aria-disabled={!!curSong}
      >
        Audio Extension Not Supported
      </audio>
      {children}
    </audioContext.Provider>
  );
}
