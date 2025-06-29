import { useEffect, useRef, useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

type colorPickerProps = {
  onLeftSide: boolean;
  color: string;
  setColor: React.Dispatch<React.SetStateAction<string>>;
};

export default function ColorPicker({
  onLeftSide,
  color,
  setColor,
}: colorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative flex items-center">
      <button
        ref={buttonRef}
        className="h-[15px] w-[15px] rounded-full border-2 border-black hover:cursor-pointer"
        style={{ backgroundColor: color }}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div
          ref={pickerRef}
          className={`absolute top-[-210px] ${onLeftSide ? "right-0" : "left-0"}`}
        >
          <HexAlphaColorPicker color={color} onChange={setColor} />
        </div>
      )}
    </div>
  );
}
