import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// create a wrapper to add users to the database

import db from "@/lib/db";
// import { randomUUID } from "crypto";
import { v4 as uuid } from "uuid";
import { User } from "@/lib/db";
import { toast } from "sonner";
import { BaseDirectory, writeTextFile } from "@tauri-apps/api/fs";
import { string } from "zod";

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  const useruid = uuid();
  const user: User = {
    name,
    email,
    password,
    id: useruid,
  };

  await db.users.add(user);
  return useruid;
}

export const getUser = async () => {
  const loginID = sessionStorage.getItem("auth-session-kodestar")?.slice(1, -1);
  if (!loginID) throw Error("User id not found!!");

  const user = await db.users.get({ id: loginID });
  if (!user) throw Error("User details not found");

  return user;
};

export const writeTempate = async ({
  language,
  username,
  projectId,
}: {
  language: string;
  username: string;
  projectId: string;
}) => {
  const template = {
    js: "console.log('Coding is awesome!')\n",
    python: "print('Coding is awesome!')\n",
    java: "System.out.println('Coding is awesome!');\n",
    csharp: "Console.WriteLine('Coding is awesome!');\n",
    ruby: "puts 'Coding is awesome!'\n",
    php: "echo 'Coding is awesome!';\n",
    cpp: "#include <iostream>\nint main() {\n    std::cout << 'Coding is awesome!' << std::endl;\n    return 0;\n}\n",
    go: "package main\nimport \"fmt\"\nfunc main() {\n    fmt.Println('Coding is awesome!')\n}\n",
    swift: "print('Coding is awesome!')\n",
    kotlin: "fun main() {\n    println('Coding is awesome!')\n}\n",
  };

  await writeTextFile(
    {
      path: `databases/user_projects/${username}/${projectId}/main.${language}`,
      //@ts-ignore
      contents: template[language] || "//edit this to start working!!",
    },
    { dir: BaseDirectory.AppData }
  );
};
