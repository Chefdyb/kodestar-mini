import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
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
}

const SourceContext = createContext<ISourceContext>({
  closeOpenedFile: () => {},
  selectedFileContent: "",
  openedFiles: [],
  editSelectedFile: () => {},
  addToOpenedFiles: () => {},
  selected: "",
  setSelect: () => {},
  selectedFile: null,
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

  const editSelectedFile = useCallback(
    (newContent: string) => {
      setOpenedFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === selected ? { ...file, newContent } : file
        )
      );
    },
    [selected, openedFiles]
  ); // Gets the selected file in the opened files and changes the newContent with the one passed as a parameter
  const selectedFile = useMemo(() => {
    const selectedFile = openedFiles.find((item) => item.id === selected);
    return selectedFile ? selectedFile : null;
  }, [selected, openedFiles]);
  const selectedFileContent = useMemo(() => {
    const selectedFile = openedFiles.find((item) => item.id === selected);
    return selectedFile ? selectedFile.newContent : "";
  }, [selected, openedFiles]); // Retrieves the content of the selected file

  const closeOpenedFile = useCallback(
    (id: string) => {
      setOpenedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      if (selected === id) {
        setSelected(openedFiles[0]?.id || "");
      }
    },
    [selected]
  ); // Removes a file from the opened files and clears the selection if it was the selected file

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
