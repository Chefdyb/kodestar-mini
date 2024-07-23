"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { appDataDir, BaseDirectory } from "@tauri-apps/api/path";
import { readDirectory, writeFile } from "@/helpers/filesys";
import { IFile } from "@/types";
import NavFiles from "./NavFiles";
import { useSource } from "@/context/NewSourceContext";
import { getUser } from "@/lib/utils";
import { type } from "@tauri-apps/api/os";
import { PlusIcon } from "@radix-ui/react-icons";
import { saveFileObject } from "@/stores/file";
import { nanoid } from "nanoid";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaFileImage, FaFolder, FaLeftLong } from "react-icons/fa6";
import { createDir } from "@tauri-apps/api/fs";
import db, { Project } from "@/lib/db";
import { toast } from "sonner";
import {
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder,
} from "vscode-icons-js";

const NewSidebar = ({ projectId }: { projectId: string }) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [unfold, setUnfold] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newItem, setNewItem] = useState<"file" | "folder" | null>(null);
  const [filename, setFilename] = useState("");

  const loadProject = async () => {
    const appDataDirPath = await appDataDir();
    const osType = await type();

    const { id } = await getUser();

    const path =
      osType === "Windows_NT"
        ? `${appDataDirPath}/databases/user_projects/${id}/${projectId}/`
        : `${appDataDirPath}databases/user_projects/${id}/${projectId}/`;
    console.log("path", path);
    readDirectory(path).then((files) => {
      setFiles(files);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };
  useEffect(() => {
    loadProject();
  }, []);

  const onEnter = async (key: string) => {
    if (key === "Escape") {
      setNewItem(null);
      setFilename("");
      return;
    }

    if (key !== "Enter") return;

    // const filePath = `${file.path}/${filename}`;

    const { id } = await getUser();
    const osType = await type();

    const appDataDirPath = await appDataDir();
    const projectPath =
      osType === "Windows_NT"
        ? `databases\\user_projects\\${id}\\${projectId}\\`
        : `databases/user_projects/${id}/${projectId}/`;

    if (newItem == "folder") {
      const folderName = filename;

      await createDir(projectPath + folderName, {
        dir: BaseDirectory.AppData,
        recursive: true,
      });
      const id = nanoid();
      const newFile: IFile = {
        id,
        name: filename,
        path: appDataDirPath + projectPath + folderName,
        kind: "directory",
      };

      saveFileObject(id, newFile);
      setFiles((prevEntries) => [newFile, ...prevEntries]);
      setNewItem(null);
      setFilename("");
    } else {
      const filePath = `${appDataDirPath}${projectPath}/${filename}`;
      writeFile(filePath, "").then(() => {
        const id = nanoid();
        const newFile: IFile = {
          id,
          name: filename,
          path: filePath,
          kind: "file",
        };
        console.log(newFile);

        saveFileObject(id, newFile);
        setFiles((prevEntries) => [newFile, ...prevEntries]);
        setNewItem(null);
        setFilename("");
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-full font-mono px-2">
      {/* <div className=" w-full font-bold text-gray-200 font-mono  p-4 pb-4 hidden">
       

        <NewFileThing setNewFile={setNewItem} projectId={projectId} />
      </div> */}
      <ProjectHeader projectId={projectId} setNewFile={setNewItem} />
      {/* <Button onClick={() => router.push("/")}>Go </Button> */}
      <div>
        {newItem ? (
          <InputForNewFolderAndFile
            setFilename={setFilename}
            setNewItem={setNewItem}
            newItem={newItem}
            onEnter={onEnter}
            filename={filename}
          />
        ) : null}
        <NavFiles visible={true} files={files} removeFile={removeFile} />
      </div>
    </div>
  );
};

export default NewSidebar;

export const NewFileThing = ({
  setNewFile,
  variant,
}: {
  setNewFile: (arg1: "folder" | "file") => void;
  variant?: "v1";
}) => {
  return (
    <div className=" flex justify-between items-center ">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-transparent hover:bg-yellow-700 hover:bg-opacity-20">
            {!(variant === "v1") && <span>new</span>} <PlusIcon className="" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          style={{
            WebkitBackdropFilter: "blur(5px)",
          }}
          className="bg-yellow-700 bg-opacity-20 border border-yellow-700 text-stone-200 backdrop-blur-xl backdrop-filter "
        >
          <DropdownMenuItem
            onClick={() => setNewFile("folder")}
            className=" focus:bg-yellow-900 focus:text-stone-300"
          >
            folder
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem
            onClick={() => setNewFile("file")}
            className=" focus:bg-yellow-900 focus:text-stone-300"
          >
            file
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const ProjectHeader = ({
  projectId,
  setNewFile,
}: {
  projectId: string;
  setNewFile: (arg1: "folder" | "file") => void;
}) => {
  const [projectData, setProjectData] = useState<Project | null>(null);

  useEffect(() => {
    db.projects
      .where("id")
      .equals(projectId)
      .first()
      .then((res) => {
        setProjectData(res || null);
      })
      .catch((e) => {
        toast.error(e.message);
      });
  }, []);

  const router = useRouter();

  return (
    <div className=" w-full font-bold text-gray-200 font-mono  flex flex-col gap-3 items-start border-b border-gray-600  mb-4">
      <Button
        className="p-0  gap-2 group animate-in text-gray-400"
        variant={"link"}
        onClick={() => {
          router.push("/home");
        }}
      >
        <FaLeftLong />
        <span className="group-hover:visible invisible"> back to home</span>
      </Button>
      <div className="pb-1 flex justify-between w-full">
        <span className="text-lg  ">{projectData?.name}</span>
        <NewFileThing setNewFile={setNewFile} />
      </div>
    </div>
  );
};

const InputForNewFolderAndFile = ({
  filename,
  onEnter,
  setNewItem,
  setFilename,
  newItem,
}: {
  filename: string;
  onEnter: (p1: string) => void;
  setNewItem: (p1: "folder" | "file" | null) => void;
  setFilename: (p1: string) => void;
  newItem: "folder" | "file";
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [newItem, inputRef]);
  return (
    <div className="flex items-center gap-0.5 p-2 w-full">
      {newItem === "folder" ? (
        <img
          className="text-yellow-800 mr-3 h-5"
          src={"/icons/" + getIconForFolder(filename || "")}
        />
      ) : (
        <img
          className="text-yellow-800 mr-3 h-5"
          src={"/icons/" + getIconForFile(filename || "")}
        />
      )}
      <input
        type="text"
        ref={(inp) => {
          inp?.focus();
        }}
        value={filename}
        onChange={(ev) => setFilename(ev.target.value)}
        onKeyUp={(ev) => onEnter(ev.key)}
        className="py-[2px] bg-stone-200  bg-opacity-30 w-full text-stone-200 outline-yellow-800 outline outline-1 px-2"
        onBlur={() => {
          setNewItem(null);
          setFilename("");
        }}
        defaultValue={" s"}
      />
    </div>
  );
};
