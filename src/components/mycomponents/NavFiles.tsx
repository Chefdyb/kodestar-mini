"use client";
import { MouseEvent, useState } from "react";

import { IFile } from "@/types";

import NavFolderItem from "./NavFolderItem";
import { useSource } from "@/context/NewSourceContext";
import { deleteFile, readFile } from "@/helpers/filesys";
import { getIconForFile } from "vscode-icons-js";

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
  removeFile?: (id: string) => void;
}

export default function NavFiles({
  files,
  visible,

  removeFile,
}: Props) {
  const { selected, setSelect, addToOpenedFiles } = useSource();

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
            <NavFolderItem
              active={isSelected}
              key={file.id}
              file={file}
              removeItem={removeFile}
            />
          );
        }

        return (
          <AlertDialog key={file.id}>
            <ContextMenu modal={false}>
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
                  <AlertDialogTrigger className="w-full text-left">
                    Delete
                  </AlertDialogTrigger>
                </ContextMenuItem>
              </ContextMenuContent>
              <DeleteModal
                fileToBeDeleted={deleteDetails}
                files={files}
                removeFile={removeFile}
              />
            </ContextMenu>
          </AlertDialog>
        );
      })}
    </div>
  );
}

const DeleteModal = ({
  fileToBeDeleted,
  files,
  removeFile,
}: {
  fileToBeDeleted: IFile | null;
  files: IFile[];
  removeFile?: (id: string) => void;
}) => {
  const { closeOpenedFile } = useSource();
  const [loading, setLoading] = useState(false);
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
        <AlertDialogAction
          onClick={async () => {
            if (!fileToBeDeleted) return;
            setLoading(true);
            console.log(fileToBeDeleted.path);
            setLoading(false);
            // return;
            await deleteFile(fileToBeDeleted.path);
           if(removeFile) removeFile(fileToBeDeleted.id);
            // loadProject();
            closeOpenedFile(fileToBeDeleted.id);
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
