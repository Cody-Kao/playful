import { ComponentProps, useEffect, useState } from "react";
import ColorPicker from "./ColorPicker";
import { usePlayerContext } from "../context/PlayerContextProvider";
import { getLyrics, parseLyricLine } from "../Utils/utils";
import SyncedLyrics from "./SyncedLyrics";
import { SyncedLyricsData } from "../Types/types";

type lyricsDisplayProps = {
  openLyrics: boolean;
} & ComponentProps<"div">;

export default function LyricsDisplay({
  openLyrics,
  className,
  ...props
}: lyricsDisplayProps) {
  const { curSong } = usePlayerContext();
  const [lyrics, setLyrics] = useState<SyncedLyricsData[] | null>(null);
  const [lyricsColor, setLyricsColor] = useState("#fff");
  const [bgColor, setBgColor] = useState("#555");

  useEffect(() => {
    if (!curSong) {
      setLyrics(null);
      return;
    }
    const fetchLyrics = async () => {
      const response = await getLyrics(curSong.songPath);
      console.log(response.fullLyricsData);
      console.log(response.fullLyricsData?.syncedLyrics);
      if (response.error !== "" || response.fullLyricsData === null) {
        setLyrics(null);
        console.log(response.error ? response.error : "");
      } else {
        const lyricsData = response.fullLyricsData.syncedLyrics.split("\n");
        setLyrics(parseLyricLine(lyricsData));
      }
    };
    fetchLyrics();
  }, [curSong]);
  return (
    <div
      className={`visible absolute bottom-0 w-full overflow-hidden px-4 py-2 pb-8 break-words transition-all duration-300 ${openLyrics ? "translate-y-0" : "translate-y-[100%]"} ${className}`}
      {...props}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="LyricsDisplay flex h-full w-full flex-grow flex-col items-start justify-start overflow-auto text-[1.3rem]"
        style={{ color: lyricsColor }}
      >
        {/* {lyrics.split(/\r?\n/).map((line, index) => (
          <p key={index}>{line}</p>
        ))} */}
        <SyncedLyrics lyrics={lyrics} scrollEnabled={openLyrics} />
      </div>
      <div className="flex w-full items-center justify-between py-2">
        <div className="flex items-center gap-2">
          <span>Lyrics</span>
          <ColorPicker
            onLeftSide={false}
            color={lyricsColor}
            setColor={setLyricsColor}
          />
        </div>
        <div className="flex items-center gap-2">
          <span>BG</span>
          <ColorPicker
            onLeftSide={true}
            color={bgColor}
            setColor={setBgColor}
          />
        </div>
      </div>
    </div>
  );
}
