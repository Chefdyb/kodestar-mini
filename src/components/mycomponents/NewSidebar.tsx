"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { appDataDir } from "@tauri-apps/api/path";
import { readDirectory } from "@/helpers/filesys";
import { IFile } from "@/types";
import NavFiles from "./NavFiles";
import { useSource } from "@/context/NewSourceContext";
import { getUser } from "@/lib/utils";
import { type } from "@tauri-apps/api/os";

const NewSidebar = ({ projectId }: { projectId: string }) => {
  const [files, setFiles] = useState<IFile[]>([]);

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

  return (
    <div className="flex flex-col w-full h-full font-mono ">
      <div className=" w-full font-bold text-gray-200 font-mono">
        {projectId.toUpperCase()}
      </div>
      {/* <Button onClick={() => router.push("/")}>Go </Button> */}
      <NavFiles visible={true} files={files} removeFile={removeFile} />
    </div>
  );
};

export default NewSidebar;
