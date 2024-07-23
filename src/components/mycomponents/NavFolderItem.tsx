"use client";
import { nanoid } from "nanoid";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  createDirectory,
  deleteFolder,
  readDirectory,
  writeFile,
} from "@/helpers/filesys";
import { saveFileObject } from "@/stores/file";
import { IFile } from "@/types";
import NavFiles from "./NavFiles";
import {
  getIconForFile,
  getIconForFolder,
  getIconForOpenFolder,
} from "vscode-icons-js";
import { PlusIcon } from "@radix-ui/react-icons";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSource } from "@/context/NewSourceContext";
import { FaFolder, FaRegFileImage } from "react-icons/fa6";
import { NewFileThing } from "./NewSidebar";

interface Props {
  file: IFile;
  active: boolean;
  removeItem?: (id: string) => void;
}
export default function NavFolderItem({ file, active, removeItem }: Props) {
  const [files, setFiles] = useState<IFile[]>([]);
  const [unfold, setUnfold] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [newFile, setNewFile] = useState(false);
  const [filename, setFilename] = useState("");

  const [newItem, setNewItem] = useState<"file" | "folder" | null>(null);

  const [deleteDetails, setDeleteDetails] = useState<IFile | null>(null);

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

  const onEnter = async (key: string) => {
    if (key === "Escape") {
      setNewFile(false);
      setFilename("");
      return;
    }

    if (key !== "Enter") return;
    if (newItem === "file") {
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
        setNewItem(null);
        setFilename("");
        setUnfold(true);
      });
    }

    const newFolderPath = `${file.path}/${filename}`;
    if (newItem === "folder") {
      console.log("it is me, mother sucker");
      const id = nanoid();
      const newFile: IFile = {
        id,
        name: filename,
        path: newFolderPath,
        kind: "directory",
      };
      await createDirectory(newFolderPath);
      saveFileObject(id, newFile);
      setFiles((prevEntries) => [newFile, ...prevEntries]);
      setNewItem(null);
      setFilename("");
    }
  };

  const iconName = useMemo(() => {
    return unfold
      ? getIconForOpenFolder(file.name)
      : getIconForFolder(file.name);
  }, [unfold]);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id));
  };

  console.log("these are all thhe files", files);
  return (
    <div className="soure-item">
      <AlertDialog key={file.id}>
        <ContextMenu modal={false}>
          <ContextMenuTrigger>
            <div
              className={`source-folder group ${
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
                <NewFileThing setNewFile={setNewItem} variant="v1" />
              </div>
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
            folderToBeDeleted={deleteDetails}
            files={files}
            removeFile={removeItem}
          />
        </ContextMenu>
      </AlertDialog>
      {newItem ? (
        <InputForNewFolderAndFile
          setFilename={setFilename}
          setNewItem={setNewItem}
          newItem={newItem}
          onEnter={onEnter}
          filename={filename}
        />
      ) : null}

      <NavFiles visible={unfold} files={files} removeFile={removeFile} />
    </div>
  );
}

const DeleteModal = ({
  folderToBeDeleted,
  files,
  removeFile,
}: {
  folderToBeDeleted: IFile | null;
  files: IFile[];
  removeFile?: (id: string) => void;
}) => {
  const { closeOpenedFile } = useSource();
  const [loading, setLoading] = useState(false);
  if (!folderToBeDeleted) return null;

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you absolutely sure you want to delete{" "}
          <span className="text-red-800">{folderToBeDeleted.name}</span>?
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
            if (!folderToBeDeleted) return;
            setLoading(true);
            console.log(folderToBeDeleted);
            setLoading(false);
            // return;
            await deleteFolder(folderToBeDeleted.path);

            if (removeFile) removeFile(folderToBeDeleted.id);
            // loadProject();
            closeOpenedFile(folderToBeDeleted.id);
          }}
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
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
    <div className="flex items-center gap-0.5 p-2 ml-4">
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
