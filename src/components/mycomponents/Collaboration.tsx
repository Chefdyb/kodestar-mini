import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { GlassCard, GlassCardContent } from "./GlassCard";
import { Button } from "../ui/button";

const Collaboration = () => {
  return (
    <div className=" flex flex-col mt-6 max-w-lg w-full">
      <h2 className="text-lg mb-2 text-gray-400 font-mono font-extrabold">
        Collaboration
      </h2>
      <GlassCard>
        <GlassCardContent className="p-5 flex flex-col gap-4">
          <p className=" text-gray-300 font-semibold font-mono">
            Invite your friends to collaborate with you
          </p>
          <Button className="bg-yellow-800 flex gap-3 font-mono ">
            <GitHubLogoIcon height={24} width={24} />
            Connect with github
          </Button>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};
export default Collaboration;
