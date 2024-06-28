"use client";
import React, { useState } from "react";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "../ui/resizable";
import { Monaco, Editor as MonacoEditor } from "@monaco-editor/react";
import { useSearchParams } from "next/navigation";
import NewSidebar from "./NewSidebar";
import { useSource } from "@/context/NewSourceContext";
import EditorHeader from "./EditorHeader";

const Editor = () => {
    const [language, setLanguage] = useState("")
    const projectId = useSearchParams().get("projectId");
    const { editSelectedFile, selectedFileContent, selectedFile } = useSource();

    return (
        <main className=" h-screen w-full overflow-auto">
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full rounded-lg border "
            >
                <ResizablePanel
                    className="min-w-[400px] bg-darken"
                    defaultSize={25}
                >
                    <div className="flex h-full items-start justify-center p-6 ">
                        <NewSidebar projectId={projectId || ""} />
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    <div className=" ">
                        <EditorHeader />
                        {!!selectedFile ? (
                            <MonacoEditor
                                path={selectedFile.id}
                                height={"100vh"}
                                onMount={(editor, monaco) => {
                                    editor.addCommand(
                                        monaco.KeyMod.CtrlCmd |
                                            monaco.KeyCode.KeyS,
                                        () => {
                                            console.log("save");
                                        }
                                    );
                                }}
                                defaultLanguage="python"
                                language={"python"}
                                theme="vs-dark"
                                // className="bg-red-600"

                                value={selectedFileContent}
                                onChange={(content) => {
                                    editSelectedFile(content ? content : "");
                                }}
                                // options={{theme:}}
                            />
                        ) : (
                            <div>No file selected</div>
                        )}
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
};

export default Editor;
