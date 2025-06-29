import ControlButton from "./ControlButton";
import { RiRepeatOneLine } from "react-icons/ri";
import { useAudioContext } from "../context/AudioContextProvider";

export default function RepeatTrackButton() {
  const { isRepeat, toggleRepeat } = useAudioContext();
  return (
    <ControlButton
      onClick={toggleRepeat}
      className={`p-0 ${isRepeat ? "text-green-500" : ""}`}
    >
      <RiRepeatOneLine size={24} />
    </ControlButton>
  );
}
