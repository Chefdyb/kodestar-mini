"use client";
import { PlusIcon } from "@radix-ui/react-icons";
import { GlassCard, GlassCardContent } from "./GlassCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FaFolder, FaUser } from "react-icons/fa6";

const ProjectActions = ({ onCreateProject }: { onCreateProject: Function }) => {
    return (
        <Dialog>
            <div className="pt-14  w-full">
                <DialogTrigger className="w-full">
                    <GlassCard className=" flex  w-full gap-2 flex-col items-center p-2 cursor-pointer hover:bg-opacity-25">
                        <PlusIcon
                            height={43}
                            width={43}
                            color="gold"
                            className="text-yello-700"
                        />
                        <GlassCardContent className="text-lg text-gray-300 font-bold font-mono text-center">
                            New Project
                        </GlassCardContent>
                    </GlassCard>
                </DialogTrigger>
                {/* <GlassCard className=' flex  aspect-square gap-2 flex-col items-center p-2 cursor-pointer hover:bg-opacity-25'>
          <FaFolder size={43} color='gold' className='text-yello-700' />
          <GlassCardContent className='text-lg text-gray-300 font-bold font-mono text-center'>
            Project <br />
            Explorer
          </GlassCardContent>
        </GlassCard>
        <GlassCard className=' flex  aspect-square gap-2 flex-col justify-center items-center p-2 cursor-pointer hover:bg-opacity-25'>
          <FaUser size={21} color='gold' className='text-yello-700' />
          <GlassCardContent className='text-lg text-gray-300 font-bold font-mono text-center'>
            User
            <br />
            Profile
          </GlassCardContent>
        </GlassCard> */}
                <SOmeg handleCreateProject={onCreateProject} />
            </div>
        </Dialog>
    );
};

export default ProjectActions;

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";

const SOmeg = ({ handleCreateProject }: { handleCreateProject: Function }) => {
    const [projectDetails, setProjectDetails] = useState({
        name: "",
        language: "",
    });
    return (
        <DialogContent className="sm:max-w-[425px] font-mono  bg-stone-800 text-gray-300">
            <DialogHeader>
                <DialogTitle className="text-center">
                    Create project
                </DialogTitle>
                <DialogDescription className="text-center">
                    Create a new project to start coding
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-col  gap-4 ">
                    <Label htmlFor="name" className="text-left text-yellow-600">
                        Project Name
                    </Label>
                    <Input
                        required
                        id="name"
                        className="col-span-3"
                        value={projectDetails.name}
                        onChange={(e) => {
                            setProjectDetails((init) => ({
                                ...init,
                                name: e.target.value,
                            }));
                        }}
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <Label htmlFor="username" className="text-yellow-600">
                        Projects &apos; primary language
                    </Label>
                    <Select
                        required
                        value={projectDetails.language}
                        onValueChange={(value) => {
                            setProjectDetails((init) => ({
                                ...init,
                                language: value,
                            }));
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Languages" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cpp">C++</SelectItem>
                            <SelectItem value="py">Python</SelectItem>
                            <SelectItem value="js">Javascript</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button
                    type="submit"
                    className="w-full"
                    onClick={() => handleCreateProject(projectDetails)}
                >
                    Create Project
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
