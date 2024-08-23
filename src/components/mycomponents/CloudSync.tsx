import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { GlassCard, GlassCardContent } from "./GlassCard";
import { toast } from "sonner";

const CloudSync = () => {
    return (
        <div className=" flex flex-col mt-6 max-w-lg w-full">
            <h2 className="text-lg mb-2 text-gray-400 font-mono font-extrabold">
                Cloud Sync
            </h2>
            <GlassCard>
                <GlassCardContent className="p-5 flex flex-col gap-4">
                    <p className=" text-gray-300 font-semibold font-mono">
                        Sync your projects with github for a seamless
                        intergration of your workflow
                    </p>
                    <Button
                        className="bg-yellow-800/20 hover:bg-yellow-800/20 flex gap-3 font-mono cursor-not-allowed  "
                        onClick={() => {
                            toast.error("Feature not available yet");
                        }}
                    >
                        <GitHubLogoIcon height={24} width={24} />
                        Connect with github
                    </Button>
                </GlassCardContent>
            </GlassCard>
        </div>
    );
};

export default CloudSync;
