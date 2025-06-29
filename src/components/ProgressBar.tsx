import { ComponentProps, useState } from "react";
import { usePlayerContext } from "../context/PlayerContextProvider";
import { formatTimestamp } from "../Utils/utils";
import { useAudioContext } from "../context/AudioContextProvider";

type ProgressBarProps = ComponentProps<"div">;

export default function ProgressBar({ className, ...props }: ProgressBarProps) {
  const { curSong } = usePlayerContext();
  const { currentTime, duration, seekTo } = useAudioContext();
  const [isHovered, setIsHovered] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [tempTime, setTempTime] = useState(currentTime);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempTime(Number(e.target.value)); // Update visual position
  };

  const handleMouseUp = () => {
    seekTo(tempTime); // Apply seek only on release
    setIsSeeking(false);
  };

  // Calculate progress percentage for styling
  const progressPercentage = curSong ? (currentTime / duration) * 100 : 0;

  if (!curSong) {
    return (
      <div className="relative h-[5px] w-full rounded-full bg-gray-500"></div>
    );
  }

  return (
    <div className={`group flex w-full flex-col gap-1 ${className}`} {...props}>
      {/* Progress Bar */}

      <div
        className="relative h-[5px] w-full rounded-full bg-gray-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <input
          type="range"
          min={0}
          max={duration}
          value={isSeeking ? tempTime : currentTime} // Show tempTime while dragging
          onChange={handleChange}
          onMouseDown={() => setIsSeeking(true)} // Start seeking
          onMouseUp={handleMouseUp} // Finalize seek
          className={`absolute inset-0 h-full w-full appearance-none rounded-full bg-transparent transition-all duration-200 hover:cursor-pointer [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-opacity [&::-webkit-slider-thumb]:duration-200 ${isHovered ? "[&::-webkit-slider-thumb]:opacity-100" : ""} [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:opacity-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-opacity [&::-moz-range-thumb]:duration-200 ${isHovered ? "[&::-moz-range-thumb]:opacity-100" : ""} `}
          style={{
            background: `linear-gradient(to right, ${isHovered ? "#f97316" : "#f59e0b"} ${progressPercentage}%, transparent ${progressPercentage}%)`,
          }}
        />
      </div>

      {/* Time Indicators */}

      <div className="flex items-center justify-between text-[.8rem]">
        <span>
          {isSeeking ? formatTimestamp(tempTime) : formatTimestamp(currentTime)}
        </span>
        <span>{formatTimestamp(duration)}</span>
      </div>
    </div>
  );
}
