"use client";
import CloudSync from "@/components/mycomponents/CloudSync";
import db from "@/lib/db";
import Collaboration from "@/components/mycomponents/Collaboration";
import FileIcon from "@/components/mycomponents/FileIcon";
import {
    GlassCard,
    GlassCardContent,
} from "@/components/mycomponents/GlassCard";
import ProjectList from "@/components/mycomponents/ProjectsList";
import SearchFilter from "@/components/mycomponents/SearchFilter";
import ProjectActions from "@/components/mycomponents/projectActions";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, GitHubLogoIcon, PlusIcon } from "@radix-ui/react-icons";
import React, { useState, useEffect } from "react";
import { createDir, BaseDirectory, writeTextFile, readDir } from "@tauri-apps/api/fs";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db";

function App() {
    const [user, setUser] = useState<User | null | undefined>(null);
    const router = useRouter();
    const getUser = async (id: string | null | undefined) => {
        const user = await db.users.get({ id });
        
        setUser(user);
    };


    const onCreateProject = async (details: {
        name: string;
        language: string;
    }) => {
        const { name, language } = details;
        //create the user project folder

        await createDir("databases/user_projects/divquan/" + name, {
            dir: BaseDirectory.AppData,
            recursive: true,
        });
        // /Users/user/Library/Application Support/com.tauri.dev/someth/user_projects/divquanJj
        // Write a text file to the `$APPCONFIG/app.conf` path
        await writeTextFile(
            {
                path: "databases/user_projects/divquan/" + name + "/app.js",
                contents: "const somethng = ()=>{}",
            },
            { dir: BaseDirectory.AppData }
        );
        router.push("/editor/?projectId=" + name);
        console.log("Project created");
    };

    useEffect(() => {
        try {
            const loginID = sessionStorage
                .getItem("auth-session-kodestar")
                ?.slice(1, -1);

            if (!loginID) {
                router.push("/login");
                return;
            }

            getUser(loginID);
        } catch (error) {
            console.error("Error fetching user:", error);
            router.push("/login");
        }
    }, []);

    return (
        <div className="w-screen h-screen bg-stone-800 flex items-center justify-center flex-col">
            <div className="flex flex-col max-w-5xl w-full ">
                <h1 className="text-base mb-4 text-gray-400 font-mono font-extrabold">
                    Project Dashboard
                </h1>
                <h1 className="text-3xl mb-4 text-gray-200 font-mono font-extrabold">
                    {`Welcome, ${user?.name}`}
                </h1>
                <div className=" flex  items-start gap-14 ">
                    <RecentProjects />
                    <div className="flex-1">
                        <ProjectActions onCreateProject={onCreateProject} />
                        <CloudSync />
                        <Collaboration />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

const RecentProjects = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredData = projects.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        readDir('', { dir: BaseDirectory.AppData, recursive: true })
            .then((res) => { console.log(res) })
                .catch((e) => console.warn(e));

    }, [])
    return (
        <div className=" flex flex-col mt-6 max-w-lg w-full ">
            <h2 className="text-lg mb-2 text-gray-400 font-mono font-extrabold">
                Recent Projects
            </h2>
            <GlassCard className="h-[600px] ">
                <GlassCardContent>
                    <SearchFilter
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                    />{
                        <ProjectList projects={filteredData} />}
                </GlassCardContent>
            </GlassCard>
        </div>
    );
};

const projects = [
    {
        name: "Inheritance - OOP",
        lastModified: "2023-06-09",
        language: ["css"],
    },
    {
        name: "Bubble Sort - Data Structures",
        lastModified: "2023-06-08",
        language: ["html"],
    },
    {
        name: "Quick Sort - Algorithms",
        lastModified: "2023-05-15",
        language: ["py"],
    },
    {
        name: "Hash Tables - Data Structures",
        lastModified: "2023-04-22",
        language: ["png"],
    },
    {
        name: "Multithreading - Concurrency",
        lastModified: "2023-03-18",
        language: ["js"],
    },
    {
        name: "Dynamic Programming - Algorithms",
        lastModified: "2023-02-27",
        language: ["ts"],
    },
    {
        name: "Hash Tables - Data Structures",
        lastModified: "2023-04-22",
        language: ["png"],
    },
    {
        name: "Multithreading - Concurrency",
        lastModified: "2023-03-18",
        language: ["js"],
    },
    {
        name: "Dynamic Programming - Algorithms",
        lastModified: "2023-02-27",
        language: ["ts"],
    },
    {
        name: "Hash Tables - Data Structures",
        lastModified: "2023-04-22",
        language: ["png"],
    },
    {
        name: "Multithreading - Concurrency",
        lastModified: "2023-03-18",
        language: ["js"],
    },
    {
        name: "Dynamic Programming - Algorithms",
        lastModified: "2023-02-27",
        language: ["ts"],
    },
];
