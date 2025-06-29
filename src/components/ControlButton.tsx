import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

type controlButtonProps = {} & ComponentProps<"button">;

export default function ControlButton({
  className,
  ...props
}: controlButtonProps) {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center rounded-full p-3 transition-all duration-200 hover:scale-110 hover:cursor-pointer",
        className,
      )}
      {...props}
    ></button>
  );
}
