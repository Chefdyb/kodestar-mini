import { getUser } from "@/lib/utils";
import { type } from "@tauri-apps/api/os";
import { appDataDir } from "@tauri-apps/api/path";
import { FaCopy, FaTerminal } from "react-icons/fa6";
import { IoRefresh, IoRefreshCircleSharp } from "react-icons/io5";
import { toast } from "sonner";

const BottomBar = ({
  closeTerminal,
  projectId,
  setReload,
}: {
  closeTerminal: () => void;
  projectId: string;
  setReload: (arg: boolean) => void;
}) => {
  return (
    <div className="h-5 w-full bg-red-500 flex justify-between ">
      <div>
        <StatusButton
          title="Refresh explorer"
          icon={<IoRefresh />}
          onClick={() => {
            setReload(true);
            toast.info("Project Reloaded");
          }}
        />
      </div>
      <div className="flex ">
        <StatusButton
          title="Copy project directory"
          icon={<FaCopy />}
          onClick={async () => {
            const { id } = await getUser();

            const osType = await type();

            const appDataDirPath = await appDataDir();
            const projectPath =
              osType === "Windows_NT"
                ? `databases\\user_projects\\${id}\\${projectId}\\`
                : `databases/user_projects/${id}/${projectId}/`;

            navigator.clipboard.writeText(appDataDirPath + projectPath);
            toast.success("Project directory copied ");
          }}
        />
        <StatusButton title="" icon={<FaTerminal />} onClick={closeTerminal} />
      </div>
    </div>
  );
};
export default BottomBar;

const StatusButton = ({
  icon,
  title,
  onClick,
  loading,
}: {
  icon?: React.ReactNode;
  title: string;
  onClick?: Function;
  loading?: boolean;
}) => {
  const handleClick = async () => {
    if (onClick) onClick();
  };
  return (
    <button
      className="text-[12px] flex p-auto  items-center justify-center px-2 hover:bg-opacity-70 gap-2 bg-blue-500 text-white h-full"
      onClick={handleClick}
    >
      {title} {icon}
    </button>
  );
};
