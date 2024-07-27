import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { GlassCard, GlassCardContent } from "./GlassCard";
import { Button } from "../ui/button";
import { FaFileExport } from "react-icons/fa6";
import { Command } from "@tauri-apps/api/shell";

const ExportProject = ({ user }: { user: User }) => {
  return (
    <div className=" flex flex-col mt-6 max-w-lg w-full h-full">
      <h2 className="text-lg mb-2 text-gray-400 font-mono font-extrabold">
        Export Project
      </h2>
      <GlassCard>
        <GlassCardContent className="p-5 flex flex-col gap-14">
          <p className=" text-gray-300 font-semibold font-mono">
            Select a project and export to the your downloads folder
          </p>
          <ExportButton user={user} />
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};
export default ExportProject;

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useMemo, useState } from "react";
import db, { Project, User } from "@/lib/db";
import { type } from "os";
import { appDataDir, downloadDir } from "@tauri-apps/api/path";
import { zipDirectory } from "@/helpers/filesys";
import { toast } from "sonner";
import { invoke, shell } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/shell";
import { platform } from "@tauri-apps/api/os";

const ExportButton = ({ user }: { user: User }) => {
  const openFolder = async (folderPath: string) => {
    // let command;
    // const os = await platform();
    // console.log("Os", os);
    // if (os === "win32") {
    //   command = new Command("cmd", ["/c", "start", folderPath]);
    // } else if (os === "darwin") {
    //   console.log("executing open on mac");
    //   command = new Command("open", [folderPath]);
    // } else if (os === "linux") {
    //   command = new Command("xdg-open", [folderPath]);
    // }
    async function openFolder(path: string) {
      await invoke("show_in_folder", { path });
    }

    try {
      const res = await openFolder(folderPath);
      console.log(res);
    } catch (error) {
      console.error("Failed to open folder:", error);
    }

    // await open(path);
  };

  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<Project | null>(null);

  const filteredData = useMemo(() => {
    if (!projects) return [];
    return projects.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const handleExport = async () => {
    const projectId = selected?.id;
    if (!projectId) return;

    try {
      const osType = await platform();

      const appDataDirPath = await appDataDir();
      const { id } = user;
      const projectPath =
        appDataDirPath +
        (osType === "win32"
          ? `databases\\user_projects\\${id}\\${projectId}`
          : `databases/user_projects/${id}/${projectId}`);

      const downloadDirPath = await downloadDir();
      const date = new Date();
      const timenow = date.toDateString() + date.toLocaleTimeString();
      const zipPath = downloadDirPath + selected?.name + timenow + ".zip";
      await zipDirectory(projectPath, zipPath);

      toast.success("Project exported to" + zipPath, {
        action: (
          <Button
            onClick={() => {
              console.log("Executing actions");
              openFolder(zipPath);
            }}
          >
            Open
          </Button>
        ),
      });
    } catch (e: any) {
      console.log(e);
      toast.error(e.message);
    }
  };
  useEffect(() => {
    if (!user) return;

    db.projects
      .where("userID")
      .equals(user.id)
      .toArray()
      .then((res) => {
        setProjects(res);
      });
  }, [user]);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-yellow-800 flex gap-3 font-mono hover:bg-yellow-700/70">
          <FaFileExport size={28} />
          Start Export{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-mono bg-stone-800 border-stone-700 text-white">
        <DialogHeader>
          <DialogTitle>Export Project</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div>
            <input
              type="text"
              className=" p-2 w-full bg-transparent br rounded-full bg-white bg-opacity-10 border border-opacity-10 border-white focus:border-opacity-60 focus:outline-none text-white font-mono font-bold px-5"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col">
            {filteredData.map((project) => {
              return (
                <div
                  onClick={() =>
                    setSelected((prev) => {
                      if (prev?.id === project.id) {
                        return null;
                      }
                      return project;
                    })
                  }
                  key={project.id}
                  className={`text-left items-start justify-start  cursor-pointer     px-3 py-4 rounded-xl ${
                    project.id === selected?.id
                      ? "  bg-yellow-700 hover:bg-yellow-700/60 "
                      : " bg-stone-500/20 hover:bg-stone-500/10"
                  }`}
                >
                  {project.name}
                </div>
              );
            })}
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full border border-yellow-800 hover:bg-yellow-800/10  bg-transparent text-lg"
            onClick={handleExport}
          >
            Export{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
