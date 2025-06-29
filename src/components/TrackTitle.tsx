import { ComponentProps } from "react";
import { extractSongName } from "../Utils/utils";

type trackTitleProps = {
  title: string | undefined;
} & ComponentProps<"span">;

export default function TrackTitle({
  title,
  className,
  ...props
}: trackTitleProps) {
  return (
    <span className={`truncate text-2xl font-bold ${className}`} {...props}>
      {title !== undefined ? extractSongName(title) : "未播放歌曲"}
    </span>
  );
}
