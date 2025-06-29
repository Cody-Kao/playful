import ControlButton from "./ControlButton";
import { IoMdPause } from "react-icons/io";
import { FaPlay } from "react-icons/fa6";
import { useAudioContext } from "../context/AudioContextProvider";

export default function PlayButton() {
  const { isPlaying, togglePlay } = useAudioContext();
  return (
    <ControlButton onClick={togglePlay} className="bg-white">
      {isPlaying ? <IoMdPause size={22} /> : <FaPlay size={22} />}
    </ControlButton>
  );
}
