"use client";
import CloudSync from "@/components/mycomponents/CloudSync";
import db, { Project } from "@/lib/db";
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
import React, { useState, useEffect, useMemo } from "react";
import {
    createDir,
    BaseDirectory,
    writeTextFile,
    readDir,
    FileEntry,
} from "@tauri-apps/api/fs";
import { useRouter } from "next/navigation";
import { User } from "@/lib/db";
import { getUser, writeTempate } from "@/lib/utils";
import { toast } from "sonner";
import { nan } from "zod";
import { v4 } from "uuid";
function App() {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const onCreateProject = async (details: {
        name: string;
        language: string;
    }) => {
        if (!user?.id) toast.error("User not found");
        const { name, language } = details;
        const date = new Date();
        //create the user project folder
        const projectId = v4();
        await db.projects.add({
            cloudSynced: false,
            createdAt: date,
            id: projectId,
            name,
            modifiedAt: date,
            primaryLanguage: language,
        });

        await createDir(`databases/user_projects/${user?.id}/${projectId}`, {
            dir: BaseDirectory.AppData,
            recursive: true,
        });
        // /Users/user/Library/Application Support/com.tauri.dev/someth/user_projects/divquan
        // Write a text file to the `$APPCONFIG/app.conf` path

        await writeTempate({ language, projectId, username: user?.id || "" });
        router.push("/editor/?projectId=" + name);
        console.log("Project created");
    };

    useEffect(() => {
        getUser()
            .then((user) => setUser(user))
            .catch((e) => {
                toast.error("An error occuredd");
                console.warn("error getting user", e);
            });
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
                    <RecentProjects user={user} />
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

const RecentProjects = ({ user }: { user: User | null }) => {
    const [projects, setProjects] = useState<Project[] | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = useMemo(() => {
        if (!projects) return [];
        return projects.filter((item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [projects, searchTerm]);

    useEffect(() => {
        if (!user) return;

        console.log(user.id);
        // readDir(`databases/user_projects/${user.id}`, {
        //   dir: BaseDirectory.AppData,
        //   recursive: true,
        // })
        //   .then((res) => {
        //     console.log("rss", res);
        //     setProjects(res);
        //   })
        //   .catch((e) => console.warn(e));

        db.projects
            // .where("id")
            // .equals(user.id)
            .toArray()
            .then((res) => {
                setProjects(res);
                console.log("res", res);
            });
    }, [user]);
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
                    />
                    <ProjectList projects={filteredData} />
                </GlassCardContent>
            </GlassCard>
        </div>
    );
};
