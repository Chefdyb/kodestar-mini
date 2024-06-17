"use client";
import { MouseEvent } from "react";

import { IFile } from "@/types";
import FileIcon from "./FileIcon";
import NavFolderItem from "./NavFolderItem";
import { useSource } from "@/context/NewSourceContext";
import { readFile } from "@/helpers/filesys";

interface Props {
  files: IFile[];
  visible: boolean;
}

export default function NavFiles({ files, visible }: Props) {
  const { selected, setSelect, addToOpenedFiles, openedFiles } = useSource();

  const onShow = async (
    ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
    file: IFile
  ) => {
    ev.stopPropagation();

    if (file.kind === "file") {
      // console.log("file path", file.path);
      const fileContent = await readFile(file.path);
      // console.log("FIle content", fileContent);
      setSelect(file.id);
      addToOpenedFiles({
        id: file.id,
        initContent: fileContent,
        newContent: fileContent,
        name: file.name,
      });
    }
  };

  return (
    <div className={`source-codes ${visible ? "" : "hidden"}`}>
      {files.map((file) => {
        const isSelected = file.id === selected;

        if (file.kind === "directory") {
          return (
            <NavFolderItem active={isSelected} key={file.id} file={file} />
          );
        }

        return (
          <div
            //@ts-ignore
            onClick={(ev) => onShow(ev, file)}
            key={file.id}
            className={`soure-item ${
              isSelected ? "source-item-active " : ""
            } flex items-center gap-2 px-2 py-0.5 text-gray-500 hover:text-gray-400 cursor-pointer`}
          >
            <FileIcon name={file.name} />
            <span>{file.name}</span>
          </div>
        );
      })}
    </div>
  );
}
