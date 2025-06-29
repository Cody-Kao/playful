import { ComponentProps } from "react";
import ImageHolder from "./ImageHolder";
import { Folder } from "../Types/types";
import { FaPlus } from "react-icons/fa6";
import { usePlayerContext } from "../context/PlayerContextProvider";
import { displayNotice, extractSongName } from "../Utils/utils";
import { FaPlay } from "react-icons/fa6";

type sideBarProps = {
  folders: Folder[];
  openSideBar: boolean;
  setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
} & ComponentProps<"div">;

export default function SideBar({
  folders,
  openSideBar,
  setOpenSideBar,
  className,
  ...props
}: sideBarProps) {
  const { curFolder, setCurSong, setCurFolder, reloadFolders } =
    usePlayerContext();
  return (
    <>
      {/* overlay */}
      <div
        onClick={() => setOpenSideBar(false)}
        className={`fixed inset-0 z-1000 h-full w-full bg-black opacity-50 hover:cursor-pointer ${openSideBar ? "visible" : "invisible"}`}
      ></div>
      {/* sideBar trigger */}
      <div
        onClick={() => setOpenSideBar(true)}
        className={`group absolute top-0 left-0 flex h-full w-[10px] items-center justify-center bg-transparent hover:cursor-pointer`}
      >
        <button className="h-[150px] w-[6px] translate-x-[-150%] rounded-lg bg-white opacity-70 transition-all duration-200 group-hover:translate-x-0 hover:cursor-pointer"></button>
      </div>
      {/* sideBar */}
      <div
        className={`fixed top-0 left-0 z-1000 flex h-full w-[200px] flex-col items-center justify-start gap-4 bg-black p-2 transition-all duration-300 ${openSideBar ? "translate-x-0" : "translate-x-[-100%]"} ${className}`}
        {...props}
      >
        <div className="flex w-full items-center justify-start gap-2">
          <ImageHolder
            className="h-[60px] w-[60px] overflow-hidden rounded-full"
            imgUrl="../../public/img.jpg"
            alt="profile-image"
          ></ImageHolder>
          <span className="truncate text-[.8rem] font-bold text-white">
            Cody Kao
          </span>
        </div>
        <button
          onClick={async () => {
            const response = await window.context.addNewFolder();
            if (!response) return;
            if (response.status === "error") {
              displayNotice(response.msg);
              return;
            }
            displayNotice("歌單新增成功");
            reloadFolders();
          }}
          className="flex h-[25px] w-max items-center justify-center rounded-full bg-white px-2 text-[.8rem] hover:cursor-pointer"
        >
          新增歌單路徑&nbsp;
          <FaPlus size={18} />
        </button>
        <div className="flex flex-grow flex-col gap-4 overflow-auto">
          {folders.length > 0 ? (
            folders.map((folder) => {
              return (
                <div
                  key={folder.folderPath}
                  className="flex h-[50px] w-full items-center justify-start gap-2"
                >
                  <div className="group relative h-[50px] w-[50px]">
                    <img
                      className="h-full w-full"
                      src={folder.folderImg}
                      alt="song cover"
                    />
                    {curFolder?.folderPath !== folder.folderPath ? (
                      <button
                        onClick={async () => {
                          const response = await window.context.playSong(
                            folder.folderPath,
                          );
                          console.log(response);
                          if (response.status === "error") {
                            displayNotice(response.msg);
                            return;
                          }
                          setCurFolder(response.payload.folder);
                          setCurSong(response.payload.song);
                        }}
                        className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/50 text-[.8rem] font-bold text-white opacity-0 transition-all duration-200 group-hover:opacity-100 hover:cursor-pointer"
                      >
                        播放
                      </button>
                    ) : (
                      <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center bg-black/50 text-[.8rem] font-bold text-white">
                        <FaPlay size={12} />
                      </div>
                    )}
                  </div>

                  <span
                    className={`${curFolder?.folderPath === folder.folderPath ? "text-green-500" : "text-white"} w-[120px] truncate text-[.8rem]`}
                  >
                    {extractSongName(folder.folderPath)}
                  </span>
                </div>
              );
            })
          ) : (
            <div className="flex w-full items-center justify-center text-white">
              尚無歌單資料夾
            </div>
          )}
        </div>
      </div>
    </>
  );
}
