"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { FaFileImage, FaFolder } from "react-icons/fa6";
import { createDir } from "@tauri-apps/api/fs";

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
    <div className="flex flex-col w-full h-full font-mono ">
      <div className=" w-full font-bold text-gray-200 font-mono border border-white group">
        <span>{projectId.toUpperCase()}</span>
        <NewFileTihnig setNewFile={setNewItem} />
      </div>
      {/* <Button onClick={() => router.push("/")}>Go </Button> */}
      <div>
        {newItem ? (
          <div className="mx-4 flex items-center gap-0.5 p-2 w-full">
            {newItem === "folder" ? (
              <FaFolder className="text-yellow-800 mr-3" size={26} />
            ) : (
              <FaFileImage className="text-yellow-800 mr-3" size={26} />
            )}
            <input
              type="text"
              value={filename}
              onChange={(ev) => setFilename(ev.target.value)}
              onKeyUp={(ev) => onEnter(ev.key)}
              className="py-[2px] bg-stone-200  bg-opacity-30 w-full text-stone-200"
              onBlur={() => {
                setNewItem(null);
                setFilename("");
              }}
            />
          </div>
        ) : null}
        <NavFiles visible={true} files={files} removeFile={removeFile} />
      </div>
    </div>
  );
};

export default NewSidebar;

const NewFileTihnig = ({
  setNewFile,
}: {
  setNewFile: (arg1: "folder" | "file") => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <PlusIcon className="invisible group-hover:visible" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        <DropdownMenuItem onClick={() => setNewFile("folder")}>
          create folder
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setNewFile("file")}>
          create file
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
