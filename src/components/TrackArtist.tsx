import { ComponentProps } from "react";
import { extractArtistName } from "../Utils/utils";

type trackArtistProps = {
  artist: string | undefined;
} & ComponentProps<"span">;

export default function TrackArtist({
  artist,
  className,
  ...props
}: trackArtistProps) {
  return (
    <span className={`truncate text-xl ${className}`} {...props}>
      {artist ? extractArtistName(artist) : ""}
    </span>
  );
}
