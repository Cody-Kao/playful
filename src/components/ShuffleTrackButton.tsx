import ControlButton from "./ControlButton";
import { IoShuffle } from "react-icons/io5";
import { useAudioContext } from "../context/AudioContextProvider";

export default function ShuffleTrackButton() {
  const { isRandom, toggleRandom } = useAudioContext();
  return (
    <ControlButton
      onClick={toggleRandom}
      className={`p-0 ${isRandom ? "text-green-500" : ""}`}
    >
      <IoShuffle size={24} />
    </ControlButton>
  );
}
