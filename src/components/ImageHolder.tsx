import { ComponentProps, useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { useAudioContext } from "../context/AudioContextProvider";
import { SlideDir } from "../Types/types";

type ImageHolderProps = {
  imgUrl: string;
  alt: string;
  transitionDuration?: number;
  easing?: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
} & ComponentProps<"div">;

export default function ImageHolder({
  className,
  imgUrl,
  alt,
  children,
  transitionDuration = 300,
  easing = "ease-in-out",
  ...props
}: ImageHolderProps) {
  const { slideDir } = useAudioContext();
  const [activeImg, setActiveImg] = useState(imgUrl);
  const [incomingImg, setIncomingImg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionRef = useRef<NodeJS.Timeout>();
  useEffect(() => {
    if (imgUrl !== activeImg) {
      setIncomingImg(imgUrl);
      setIsTransitioning(true);

      if (transitionRef.current) clearTimeout(transitionRef.current);

      transitionRef.current = setTimeout(() => {
        setActiveImg(imgUrl);
        setIncomingImg(null);
        setIsTransitioning(false);
      }, transitionDuration);
    }

    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, [imgUrl, activeImg, transitionDuration]);

  const getTranslateClass = (isEntering: boolean, dir: SlideDir) => {
    if (isEntering) {
      switch (dir) {
        case "Left":
          return "translate-x-full"; // enters from the right
        case "Right":
          return "-translate-x-full"; // enters from the left
        case "Up":
          return "translate-y-full"; // enters from bottom
        case "Down":
          return "-translate-y-full"; // enters from top
        default:
          return "translate-x-0";
      }
    } else {
      switch (dir) {
        case "Left":
          return "translate-x-full"; // exits to left
        case "Right":
          return "-translate-x-full"; // exits to right
        case "Up":
          return "-translate-y-full"; // exits to top
        case "Down":
          return "translate-y-full"; // exits to bottom
        default:
          return "translate-x-0";
      }
    }
  };

  return (
    <div className={twMerge("relative", className)} {...props}>
      {/* Incoming image */}
      {incomingImg && (
        <img
          src={incomingImg}
          alt={alt}
          className={twMerge(
            "absolute inset-0 h-full w-full object-cover opacity-0",
            "transition-all",
            `duration-[${transitionDuration}ms] ease-${easing}`,
            getTranslateClass(true, slideDir),
            isTransitioning && "z-10",
          )}
          style={{ transitionDuration: `${transitionDuration}ms` }}
        />
      )}

      {/* Active image (fade or slide out) */}
      <img
        src={activeImg}
        alt={alt}
        className={twMerge(
          "absolute inset-0 h-full w-full object-cover",
          "transition-transform",
          `duration-[${transitionDuration}ms] ease-${easing}`,
          incomingImg ? getTranslateClass(false, slideDir) : "translate-x-0",
          "z-0",
        )}
        style={{ transitionDuration: `${transitionDuration}ms` }}
      />

      {children}
    </div>
  );
}
