import { ComponentProps } from "react";

type trackInfoProps = {} & ComponentProps<"div">;

export default function TrackInfo({
  className,
  children,
  ...props
}: trackInfoProps) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}
