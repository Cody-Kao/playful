import { useState, ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { HiMiniSpeakerWave, HiMiniSpeakerXMark } from "react-icons/hi2";
import { useAudioContext } from "../context/AudioContextProvider";
import { usePlayerContext } from "../context/PlayerContextProvider";

type volumeControlProps = ComponentProps<"div">;

export default function VolumeControl({
  className,
  ...props
}: volumeControlProps) {
  const { curSong } = usePlayerContext();
  const { volume, changeVolume } = useAudioContext();
  const [isHovered, setIsHovered] = useState(false);
  const [preVolume, setPreVolume] = useState(volume);
  const isMuted = volume === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeVolume(Number(e.target.value));
    setPreVolume(Number(e.target.value));
  };

  const handleClickSpeaker = () => {
    if (isMuted) {
      if (preVolume === 0) {
        changeVolume(100);
      } else {
        changeVolume(preVolume);
      }
    } else {
      changeVolume(0);
    }
  };

  return (
    <div
      className={`group relative ml-auto flex items-center gap-2 hover:cursor-pointer ${!curSong ? "pointer-events-none opacity-50 grayscale-50" : ""}`}
    >
      {/* Volume percentage label */}
      <div
        className={`text-xs text-black opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
      >
        {volume}%
      </div>

      {/* Volume control bar */}
      <div className="flex flex-col items-center justify-center">
        <div
          className="absolute bottom-6 h-0 w-[5px] rounded-full bg-gray-300 transition-all duration-200 group-hover:h-[80px]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={handleChange}
            className={`vertical-slider absolute inset-0 h-full w-full appearance-none rounded-full bg-transparent transition-all duration-200 hover:cursor-pointer [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-opacity [&::-webkit-slider-thumb]:duration-200 ${isHovered ? "[&::-webkit-slider-thumb]:opacity-100" : ""} [&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:opacity-0 [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:transition-opacity [&::-moz-range-thumb]:duration-200 ${isHovered ? "[&::-moz-range-thumb]:opacity-100" : ""} `}
            style={{
              background: `linear-gradient(to top, ${isHovered ? "#f97316" : "#f59e0b"} ${volume}%, transparent ${volume}%)`,
            }}
          />
        </div>
        <div
          onClick={handleClickSpeaker}
          className={twMerge("", className)}
          {...props}
        >
          {isMuted ? (
            <HiMiniSpeakerXMark size={22} />
          ) : (
            <HiMiniSpeakerWave size={22} />
          )}
        </div>
      </div>
    </div>
  );
}
