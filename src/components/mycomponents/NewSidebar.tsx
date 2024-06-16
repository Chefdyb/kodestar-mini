import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { appDataDir } from "@tauri-apps/api/path";
import { readDirectory } from "@/helpers/filesys";
import { IFile } from "@/types";
import NavFiles from "./NavFiles";
import { useSource } from "@/context/NewSourceContext";

const NewSidebar = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [files, setFiles] = useState<IFile[]>([]);

  const loadProject = async () => {
    const appDataDirPath = await appDataDir();
    console.log(appDataDirPath);
    readDirectory(
      appDataDirPath + "/databases/user_projects/divquan/" + projectId + "/"
    ).then((files) => {
      // console.log(files);
      setFiles(files);
    });
  };
  useEffect(() => {
    loadProject();
  }, []);

  return (
    <div className="flex flex-col w-full h-full font-mono ">
      <div className=" w-full font-bold">{projectId.toUpperCase()}</div>
      {/* <Button onClick={() => router.push("/")}>Go </Button> */}
      <NavFiles visible={true} files={files} />
    </div>
  );
};

export default NewSidebar;
