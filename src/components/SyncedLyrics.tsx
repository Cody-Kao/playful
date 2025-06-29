import { useAudioContext } from "../context/AudioContextProvider";
import { SyncedLyricsData } from "../Types/types";
import { useEffect, useRef } from "react";

type SyncedLyricsProps = {
  lyrics: SyncedLyricsData[] | null;
  scrollEnabled: boolean;
};

export default function SyncedLyrics({
  lyrics,
  scrollEnabled,
}: SyncedLyricsProps) {
  const { currentTime, seekTo } = useAudioContext();

  const activeIndex = lyrics?.findIndex((line, i) => {
    const nextTime = lyrics[i + 1]?.seconds ?? Infinity;
    return currentTime >= line.seconds && currentTime < nextTime;
  });

  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  // 換歌自動到第一行
  useEffect(() => {
    if (!scrollEnabled || !lineRefs.current[0]) return;
    lineRefs.current[0].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [lyrics]);
  // 自動跟到目前唱到的行數
  useEffect(() => {
    if (
      scrollEnabled &&
      activeIndex !== undefined &&
      activeIndex !== -1 &&
      lineRefs.current[activeIndex]
    ) {
      lineRefs.current[activeIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeIndex]);

  if (!lyrics) return <div>No Lyrics Provided</div>;

  return (
    <div className="LyricsDisplay flex h-full flex-col gap-1 overflow-auto px-4 text-[1.3rem]">
      {lyrics.map((line, index) => (
        <p
          onClick={() => seekTo(line.seconds)}
          key={index}
          ref={(el) => (lineRefs.current[index] = el)}
          className={`transition-colors duration-300 hover:cursor-pointer ${
            index === activeIndex
              ? "text-[1.5rem] font-bold opacity-100"
              : index < activeIndex!
                ? "opacity-50 grayscale-50"
                : "opacity-70"
          }`}
        >
          {line.lyrics}
        </p>
      ))}
    </div>
  );
}
