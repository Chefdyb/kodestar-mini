"use client";
import Sidebar from "@/components/mycomponents/Sidebar";
import { Button } from "@/components/ui/button";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <main className=" h-screen w-full overflow-auto">
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full rounded-lg border "
            >
                <Button
                    onClick={() => {
                        router.push("/editor?projectId=Godeys");
                    }}
                >
                    This is for divine to go a preconfigured project{" "}
                </Button>
                <Button
                    onClick={() => {
                        router.push("/editor?projectId=Heat");
                    }}
                >
                    This is for Obo to go a preconfigured project{" "}
                </Button>
                <Button
                    onClick={() => {
                        router.push("/terminal");
                    }}
                >
                    Terminal{" "}
                </Button>
                <Button
                    onClick={() => {
                        router.push("/home");
                    }}
                >
                    Go home
                </Button>
                <Button
                    onClick={() => {
                        router.push("/admin/create-user");
                    }}
                >
                    admin
                </Button>
            </ResizablePanelGroup>
        </main>
    );
}
