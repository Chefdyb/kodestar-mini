import { writeFile } from "@/helpers/filesys";
import { getFileObject } from "@/stores/file";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

type OpenedFile = {
  initContent: string;
  newContent: string;
  id: string;
  name: string;
};

interface ISourceContext {
  closeOpenedFile: (id: string) => void;
  openedFiles: OpenedFile[];
  addToOpenedFiles: (file: OpenedFile) => void;
  editSelectedFile: (newContent: string) => void;
  selectedFileContent: string;
  selected: string;
  setSelect: (id: string) => void;
  selectedFile: OpenedFile | null;
  onSave: () => void;
}

const SourceContext = createContext<ISourceContext>({
  closeOpenedFile: () => {}, //close opened file
  selectedFileContent: "", //selected file content
  openedFiles: [], //
  selected: "", // holds selected file id
  editSelectedFile: () => {}, //
  addToOpenedFiles: () => {}, //
  setSelect: () => {}, //
  selectedFile: null,
  onSave: () => {},
});

export const SourceProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [selected, setSelected] = useState<string>(""); // Holds the id of the file that is rendered in the editor
  const [openedFiles, setOpenedFiles] = useState<OpenedFile[]>([]); // List of all files that have been opened

  const setSelect = (id: string) => {
    setSelected(id);
  }; // Changes the file that is to be rendered in the editor

  const addToOpenedFiles = useCallback(
    (file: OpenedFile) => {
      if (openedFiles.find((item) => item.id === file.id)) return;
      setOpenedFiles((prev) => [...prev, file]);
    },
    [openedFiles]
  ); // Adds file to the opened files in the editor

  //write the logic well
  const editSelectedFile = useCallback(
    (newContent: string) => {
      setOpenedFiles((prevFiles) =>
        prevFiles.map((file) => {
          if (file.id === selected) {
            return { ...file, newContent: newContent };
          }
          return file;
        })
      );
    },
    [selected, openedFiles]
  ); // Gets the selected file in the opened files and changes the newContent with the one passed as a parameter

  const selectedFileContent = useMemo(() => {
    const selectedFile = openedFiles.find((item) => item.id === selected);
    return selectedFile ? selectedFile.newContent : "";
  }, [selected, openedFiles]); // Retrieves the content of the selected file

  const selectedFile = useMemo(() => {
    const file = openedFiles.find((item) => item.id === selected);
    return file ? file : null;
  }, [selected, openedFiles, selectedFileContent]);

  const closeOpenedFile = useCallback(
    (id: string) => {
      setOpenedFiles((prevFiles) => {
        const newFiles = prevFiles.filter((file) => file.id !== id);

        if (selected === id) {
          if (newFiles.length === 0) {
            setSelected("");
          } else {
            setSelected(newFiles[newFiles.length - 1].id);
          }
        }

        return newFiles;
      });
    },
    [selected]
  );
  const onSave = () => {
    const file = getFileObject(selected);
    writeFile(file.path, selectedFileContent);
    setOpenedFiles((prevFiles) =>
      prevFiles.map((file) => {
        if (file.id === selected) {
          return { ...file, initContent: file.newContent };
        }
        return file;
      })
    );
  };

  return (
    <SourceContext.Provider
      value={{
        selected,
        setSelect,
        selectedFileContent,
        closeOpenedFile,
        editSelectedFile,
        openedFiles,
        addToOpenedFiles,
        selectedFile,
        onSave,
      }}
    >
      {children}
    </SourceContext.Provider>
  );
};

export const useSource = () => {
  const context = useContext(SourceContext);
  if (!context) {
    throw new Error("useSource must be used within a SourceProvider");
  }
  return context;
};
