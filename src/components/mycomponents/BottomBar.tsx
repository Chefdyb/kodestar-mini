import { FaCopy, FaTerminal } from "react-icons/fa6";
import { IoRefresh, IoRefreshCircleSharp } from "react-icons/io5";
import { toast } from "sonner";

const BottomBar = ({ closeTerminal }:any) => {
  return (
    <div className="absolute bottom-0 h-5 w-full bg-red-500 flex justify-between">
      <div>
        <StatusButton title="Refresh explorer" icon={<IoRefresh />} />
      </div>
      <div className="flex ">
        <StatusButton
          title="Copy project directory"
          icon={<FaCopy />}
          onClick={() => {
            navigator.clipboard.writeText("project copied 🙌🏾🙌🏾🙌🏾🙌🏾🙌🏾");
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
  const handleClick = () => {
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
