"use client";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { readDirectory, writeFile } from "@/helpers/filesys";
import { saveFileObject } from "@/stores/file";
import { IFile } from "@/types";
import NavFiles from "./NavFiles";
import { getIconForFolder, getIconForOpenFolder } from "vscode-icons-js";

interface Props {
  file: IFile;
  active: boolean;
}
export default function NavFolderItem({ file, active }: Props) {
  const [files, setFiles] = useState<IFile[]>([]);
  const [unfold, setUnfold] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const [filename, setFilename] = useState("");

  const onShow = async (ev: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    ev.stopPropagation();
    try {
      if (loaded) {
        setUnfold(!unfold);
        return;
      }

      const entries = await readDirectory(file.path + "/");
      console.log("folder clicked", file.path);
      setLoaded(true);
      setFiles(entries);
      setUnfold(!unfold);
    } catch (e) {
      console.log("We caught the fucking error: ", e);
    }
  };

  const onEnter = (key: string) => {
    if (key === "Escape") {
      setNewFile(false);
      setFilename("");
      return;
    }

    if (key !== "Enter") return;

    const filePath = `${file.path}/${filename}`;

    writeFile(filePath, "").then(() => {
      const id = nanoid();
      const newFile: IFile = {
        id,
        name: filename,
        path: filePath,
        kind: "file",
      };

      saveFileObject(id, newFile);
      setFiles((prevEntries) => [newFile, ...prevEntries]);
      setNewFile(false);
      setFilename("");
    });
  };
  const iconName = useMemo(() => {
    return unfold
      ? getIconForOpenFolder(file.name)
      : getIconForFolder(file.name);
  }, [unfold]);
  return (
    <div className="soure-item">
      <div
        className={`source-folder ${
          active ? "bg-gray-200" : ""
        } flex items-center gap-2 px-2 py-0.5 text-gray-500 hover:text-gray-400 cursor-pointer`}
      >
        <img src={"/icons/" + iconName} className=" h-5" />

        <div className="source-header flex items-center justify-between w-full group">
          <span onClick={onShow}>{file.name}</span>
          <i
            onClick={() => setNewFile(true)}
            className="ri-add-line invisible group-hover:visible"
          ></i>
        </div>
      </div>

      {newFile ? (
        <div className="mx-4 flex items-center gap-0.5 p-2">
          <i className="ri-file-edit-line text-gray-300"></i>
          <input
            type="text"
            value={filename}
            onChange={(ev) => setFilename(ev.target.value)}
            onKeyUp={(ev) => onEnter(ev.key)}
            className="inp"
          />
        </div>
      ) : null}

      <NavFiles visible={unfold} files={files} />
    </div>
  );
}
