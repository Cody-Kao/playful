import { useState } from "react";
import ImageHolder from "./ImageHolder";
import NextTrackButton from "./NextTrackButton";
import PlayButton from "./PlayButton";
import PreviousTrackButton from "./PreviousTrackButton";
import ProgressBar from "./ProgressBar";
import RepeatTrackButton from "./RepeatTrackButton";
import ShuffleTrackButton from "./ShuffleTrackButton";
import TrackArtist from "./TrackArtist";
import TrackControl from "./TrackControl";
import TrackInfo from "./TrackInfo";
import TrackTitle from "./TrackTitle";
import { FaAnglesUp } from "react-icons/fa6";
import { FaAnglesDown } from "react-icons/fa6";
import LyricsDisplay from "./LyricsDisplay";
import SideBar from "./SideBar";
import { usePlayerContext } from "../context/PlayerContextProvider";
import { extractSongName } from "../Utils/utils";
import AudioContextProvider from "../context/AudioContextProvider";
import VolumeControl from "./VolumeControl";

export default function Right() {
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openLyrics, setOpenLyrics] = useState(false);
  const { folders, curSong, curFolder } = usePlayerContext();
  return (
    <div className="relative flex h-full w-[400px] flex-col items-center justify-start overflow-hidden px-4 py-2">
      <AudioContextProvider>
        <SideBar
          folders={folders}
          openSideBar={openSideBar}
          setOpenSideBar={setOpenSideBar}
        />
        <ImageHolder
          imgUrl={
            curSong
              ? curSong.img
                ? curSong.img
                : "././public/noCover.jpg"
              : "././public/notPlaying.jpg"
          }
          alt="Track Cover"
          className="flex h-[60%] w-full items-center justify-center overflow-hidden rounded-lg"
        />
        <TrackInfo className="flex w-full flex-col items-start justify-center py-2">
          <TrackTitle title={curSong?.songPath} className="w-[320px]" />
          <div className="flex w-full items-center">
            <TrackArtist artist={curSong?.songPath} className="w-[320px]" />
            <VolumeControl className="ml-auto" />
          </div>
        </TrackInfo>
        <ProgressBar />
        <TrackControl
          className={`${curSong === null ? "pointer-events-none opacity-60 grayscale-50" : ""}`}
        >
          <ShuffleTrackButton />
          <div className="flex items-center justify-between gap-6">
            <PreviousTrackButton />
            <PlayButton />
            <NextTrackButton />
          </div>
          <RepeatTrackButton />
        </TrackControl>
        <LyricsDisplay openLyrics={openLyrics} className="h-full" />
      </AudioContextProvider>
      <span
        className={`${openLyrics ? "invisible opacity-0" : "visible opacity-100"} absolute right-4 bottom-1 inline-flex w-[120px] items-center justify-end truncate text-[.8rem] text-white transition-all duration-300`}
      >
        {curFolder ? `歌單: ${extractSongName(curFolder.folderPath)}` : ""}
      </span>
      <button
        onClick={() => setOpenLyrics((prev) => !prev)}
        className="absolute bottom-1 left-[50%] translate-x-[-50%] scale-x-150 hover:cursor-pointer"
      >
        {openLyrics ? <FaAnglesDown size={18} /> : <FaAnglesUp size={18} />}
      </button>
    </div>
  );
}
