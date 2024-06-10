"use client";
import FileIcon from "@/components/mycomponents/FileIcon";
import {
  GlassCard,
  GlassCardContent,
} from "@/components/mycomponents/GlassCard";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, GitHubLogoIcon, PlusIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

function App() {
  const [projects, setProjects] = useState([
    {
      name: "Project Alpha",
      lastModified: "2023-06-09",
      language: "JavaScript",
      status: "Open",
    },
    {
      name: "Project Beta",
      lastModified: "2023-06-08",
      language: "Python",
      status: "Requires Attention",
    },
  ]);

  const handleCreateProject = (name: string) => {
    setProjects([
      ...projects,
      {
        name,
        lastModified: new Date().toISOString().split("T")[0],
        language: "JavaScript",
        status: "Open",
      },
    ]);
  };

  const handleOpenProject = (project: string) => {
    console.log("Open project:", project);
  };

  const handleDuplicateProject = (project: any) => {
    const newProject = {
      ...project,
      name: `${project.name} Copy`,
      lastModified: new Date().toISOString().split("T")[0],
    };
    setProjects([...projects, newProject]);
  };

  const handleDeleteProject = (project: any) => {
    setProjects(projects.filter((p) => p !== project));
  };

  return (
    <div className="w-screen h-screen bg-stone-800 flex items-center justify-center flex-col">
      <div className="flex flex-col max-w-5xl w-full ">
        <h1 className="text-base mb-4 text-gray-400 font-mono font-extrabold">
          Project Dashboard
        </h1>
        <h1 className="text-3xl mb-4 text-gray-200 font-mono font-extrabold">
          Welcome, Divine
        </h1>
        <div className=" flex  items-start gap-14">
          <RecentProjects />
          <div className="flex-1">
            <ProjectActions />
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
  return (
    <div className=" flex flex-col mt-6 max-w-lg w-full">
      <h2 className="text-lg mb-2 text-gray-400 font-mono font-extrabold">
        Recent Projects
      </h2>
      <GlassCard>
        <GlassCardContent>
          <SearchFilter />
          <ProjectList />
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};
const ProjectActions = ({ onCreateProject }: any) => {
  return (
    <div className="pt-14 gap-2 flex items-start justify-between ">
      <GlassCard className=" flex  aspect-square gap-2 flex-col items-center p-2 cursor-pointer hover:bg-opacity-25">
        <PlusIcon
          height={43}
          width={43}
          color="gold"
          className="text-yello-700"
        />
        <GlassCardContent className="text-lg text-gray-300 font-bold font-mono text-center">
          Create <br />
          New Project
        </GlassCardContent>
      </GlassCard>
      <GlassCard className=" flex  aspect-square gap-2 flex-col items-center p-2 cursor-pointer hover:bg-opacity-25">
        <PlusIcon
          height={43}
          width={43}
          color="gold"
          className="text-yello-700"
        />
        <GlassCardContent className="text-lg text-gray-300 font-bold font-mono text-center">
          Create <br />
          New Project
        </GlassCardContent>
      </GlassCard>{" "}
      <GlassCard className=" flex  aspect-square gap-2 flex-col items-center p-2 cursor-pointer hover:bg-opacity-25">
        <PlusIcon
          height={43}
          width={43}
          color="gold"
          className="text-yello-700"
        />
        <GlassCardContent className="text-lg text-gray-300 font-bold font-mono text-center">
          Create <br />
          New Project
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
];

const ProjectList = ({
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
}: any) => {
  return (
    <div className="flex-1">
      <div className=" space-y-0 mt-2 ">
        {projects.map((project) => (
          <div className="p-3 text-gray-400   bg-opacity-20 cursor-pointer flex  gap-3 flex-col border-b border-opacity-20 border-white hover:bg-gray-100 hover:bg-opacity-20">
            <div className="flex gap-3">
              <FileIcon extenstion={project.language[0] || ""} size="large" />
              <h2>{project.name}</h2>
            </div>
            <span className="self-end text-[11px] text-stone-500 ">
              Last accessed: {project.lastModified}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CloudSync = () => {
  return (
    <div className=" flex flex-col mt-6 max-w-lg w-full">
      <h2 className="text-lg mb-2 text-gray-400 font-mono font-extrabold">
        Cloud Sync
      </h2>
      <GlassCard>
        <GlassCardContent className="p-5 flex flex-col gap-4">
          <p className=" text-gray-300 font-semibold font-mono">
            Sync your projects with github for a seamless intergration of your
            workflow
          </p>
          <Button className="bg-yellow-800 flex gap-3 font-mono ">
            <GitHubLogoIcon height={24} width={24} />
            Connect with github
          </Button>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};

const Collaboration = () => {
  return (
    <div className=" flex flex-col mt-6 max-w-lg w-full">
      <h2 className="text-lg mb-2 text-gray-400 font-mono font-extrabold">
        Collaboration
      </h2>
      <GlassCard>
        <GlassCardContent className="p-5 flex flex-col gap-4">
          <p className=" text-gray-300 font-semibold font-mono">
            Invite your friends to collaborate with you
          </p>
          <Button className="bg-yellow-800 flex gap-3 font-mono ">
            <GitHubLogoIcon height={24} width={24} />
            Connect with github
          </Button>
        </GlassCardContent>
      </GlassCard>
    </div>
  );
};

const SearchFilter = () => {
  return (
    <div className="flex justify-between items-center py-4 gap-2">
      <input
        type="text"
        className=" p-2 w-full bg-transparent br rounded-full bg-white bg-opacity-10 border border-opacity-10 border-white focus:border-opacity-60 focus:outline-none text-white font-mono font-bold px-5"
        placeholder="Search projects..."
      />
      <Button
        variant={"ghost"}
        className="hover:text-gray-900 text-gray-100 rounded-full aspect-square p-0"
      >
        <CaretSortIcon className=" h-6 w-6  " />
      </Button>
    </div>
  );
};
