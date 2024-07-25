import { invoke } from "@tauri-apps/api/tauri";
import { nanoid } from "nanoid";
import { saveFileObject } from "@/stores/file";
import { IFile } from "@/types";

export const readFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("get_file_content", { filePath })
      .then((message: unknown) => {
        resolve(message as string);
      })
      .catch((error) => reject(error));
  });
};

export const writeFile = (
  filePath: string,
  content: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("write_file", { filePath, content }).then((message: unknown) => {
      if (message === "OK") {
        resolve(message as string);
      } else {
        reject("ERROR");
      }
    });
  });
};

export const deleteFile = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("remove_file", { filePath }).then((message: unknown) => {
      resolve(message as string);
    });
  });
};
export const deleteFolder = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("remove_folder", { filePath }).then((message: unknown) => {
      resolve(message as string);
    });
  });
};

export const createDirectory = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    invoke("create_directory", { filePath }).then((message: unknown) => {
      resolve(message as string);
    });
  });
};

export const readDirectory = (folderPath: string): Promise<IFile[]> => {
  return new Promise((resolve, reject) => {
    invoke("open_folder", { folderPath })
      .then((message: unknown) => {
        const mess = message as string;
        const files = JSON.parse(
          mess.replaceAll("\\", "/").replaceAll("//", "/")
        );
        const entries: IFile[] = [];
        const folders: IFile[] = [];

        if (!files || !files.length) {
          resolve(entries);
          return;
        }

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const id = nanoid();
          const entry: IFile = {
            id,
            kind: file.kind,
            name: file.name,
            path: file.path,
          };

          if (file.kind === "file") {
            entries.push(entry);
          } else {
            folders.push(entry);
          }

          saveFileObject(id, entry);
        }

        resolve([...folders, ...entries]);
      })
      .catch(() => {
        reject("error opening folder");

        console.log("error opening folder");
        return [];
      });
  });
};



export async function zipDirectory() {
  const srcDir = "/Users/divquan/Documents/questions"; // Change this to your folder path
  const dstFile = "/Users/divquan/Documents/questions.zip"; // Change this to your destination zip path
  try {
    await invoke('zip_dir', { srcDir, dstFile });
    console.log('Zipping completed successfully.');
  } catch (error) {
    console.error('Error occurred while zipping:', error);
  }
}