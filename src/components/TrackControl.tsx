import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type trackControlProps = {} & ComponentProps<"div">;

export default function TrackControl({
  className,
  children,
  ...props
}: trackControlProps) {
  return (
    <div
      className={twMerge(
        "flex w-full items-center justify-between py-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
