"use client";
import { MouseEvent, useState } from "react";

import { IFile } from "@/types";
import FileIcon from "./FileIcon";
import NavFolderItem from "./NavFolderItem";
import { useSource } from "@/context/NewSourceContext";
import { readFile } from "@/helpers/filesys";
import {
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder,
} from "vscode-icons-js";
import { Button } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  files: IFile[];
  visible: boolean;
}

export default function NavFiles({ files, visible }: Props) {
  const { selected, setSelect, addToOpenedFiles, openedFiles } = useSource();

  const [state, setState] = useState<"initial" | "renaming" | "deleting">(
    "initial"
  );
  const [deleteDetails, setDeleteDetails] = useState<IFile | null>(null);

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
            <AlertDialog key={file.id}>
                <ContextMenu>
                    <ContextMenuTrigger>
                        <div
                            //@ts-ignore
                            key={file.id}
                            className={`soure-item ${
                                isSelected ? "source-item-active " : ""
                            } flex items-center gap-2 px-2 py-0.5 text-gray-500 hover:text-gray-400 cursor-pointer `}
                            //@ts-ignore
                            onClick={(ev) => onShow(ev, file)}
                        >
                            <img
                                src={"/icons/" + getIconForFile(file.name)}
                                className=" h-5"
                            />
                            <span>{file.name}</span>
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem>Edit</ContextMenuItem>
                        <ContextMenuItem>Rename</ContextMenuItem>
                        <ContextMenuItem
                            className="hover:bg-red-100 text-red-800"
                            onClick={() => setDeleteDetails(file)}
                        >
                            <AlertDialogTrigger>Delete</AlertDialogTrigger>
                        </ContextMenuItem>
                    </ContextMenuContent>
                    <DeleteModal fileToBeDeleted={deleteDetails} />
                </ContextMenu>
            </AlertDialog>
        );
      })}
    </div>
  );
}

const DeleteModal = ({
  fileToBeDeleted,
}: {
  fileToBeDeleted: IFile | null;
}) => {
  if (!fileToBeDeleted) return null;
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you absolutely sure you want to delete{" "}
          <span className="text-red-800">{fileToBeDeleted.name}</span>?
        </AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Continue</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
