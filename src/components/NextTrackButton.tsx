import { useAudioContext } from "../context/AudioContextProvider";
import ControlButton from "./ControlButton";
import { MdSkipNext } from "react-icons/md";

export default function NextTrackButton() {
  const { nextSong } = useAudioContext();
  return (
    <ControlButton onClick={nextSong}>
      <MdSkipNext size={34} />
    </ControlButton>
  );
}
