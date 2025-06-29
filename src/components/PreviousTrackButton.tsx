import { useAudioContext } from "../context/AudioContextProvider";
import ControlButton from "./ControlButton";
import { MdSkipPrevious } from "react-icons/md";

export default function PreviousTrackButton() {
  const { previousSong } = useAudioContext();
  return (
    <ControlButton onClick={previousSong}>
      <MdSkipPrevious size={34} />
    </ControlButton>
  );
}
