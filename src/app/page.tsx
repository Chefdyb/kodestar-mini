"use client";

import { Button } from "@/components/ui/button";
import Animation from "@/lottifiles/welcome.json";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";

export default function Home() {
    const router = useRouter();
    return (
        <Dialog>
            <main className=" h-screen w-full overflow bg-stone-800 flex flex-col items-center justify-center">
                <div className="justify-center items-center flex flex-col relative">
                    <Lottie
                        className="max-w-xl h-full "
                        loop
                        animationData={Animation}
                        play
                    />
                    <Button
                        className="bg-yellow-800 hover:bg-yellow-800/60 px-20 py-10 text-2xl font-mono bottom-10"
                        onClick={() => {
                            router.push("/login");
                        }}
                    >
                        Get Started
                    </Button>
                </div>
                <DialogTrigger className="absolute bottom-2 right-2 font-mono text-gray-400">
                    admin
                </DialogTrigger>
            </main>
            <SOmeg />
        </Dialog>
    );
}

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
import React, { useState } from "react";
import { toast } from "sonner";

const SOmeg = () => {
    const [passwaord, setPassword] = useState("");
    const router = useRouter();
    return (
        <DialogContent className="sm:max-w-[425px] font-mono  bg-stone-800 text-gray-300">
            <DialogHeader>
                <DialogTitle className="text-center">
                    Admin password
                </DialogTitle>
                <DialogDescription className="text-center">
                    Enter admin password
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-col  gap-4 ">
                    <Label htmlFor="name" className="text-left text-yellow-600">
                        Password
                    </Label>
                    <Input
                        required
                        id="name"
                        className="col-span-3"
                        value={passwaord}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
            </div>
            <DialogFooter>
                <Button
                    type="submit"
                    className="w-full bg-yellow-800 hover:bg-yellow-800/60"
                    onClick={() => {
                        if (passwaord === "amaisagirl") {
                            router.push("/admin");
                            return;
                        }
                        toast.error("Admin password wrong");
                    }}
                >
                    Enter admin{" "}
                </Button>
            </DialogFooter>
        </DialogContent>
    );
};
