import { FiMinus } from "react-icons/fi";

export default function TopBar() {
  return (
    <div className="topBar z-1000 flex h-[25px] w-full items-center justify-end bg-transparent">
      <button
        onClick={() => window.context.windowActionFunc("CLOSE")}
        className="order-3 box-border flex h-full w-[50px] items-center justify-center px-4 py-1 hover:cursor-pointer hover:bg-red-800"
      >
        &#10005;
      </button>

      <button
        onClick={() => window.context.windowActionFunc("MINIMIZE")}
        className="order-1 box-border flex h-full w-[50px] items-center justify-center px-4 py-1 hover:cursor-pointer hover:bg-gray-500"
      >
        <FiMinus strokeWidth={2} />
      </button>
    </div>
  );
}
