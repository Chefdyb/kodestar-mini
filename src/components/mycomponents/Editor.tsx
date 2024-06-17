import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import Sidebar from "./Sidebar";
import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useSearchParams } from "next/navigation";
import NewSidebar from "./NewSidebar";
import { useSource } from "@/context/NewSourceContext";

const Editor = () => {
  const projectId = useSearchParams().get("projectId");
  const { editSelectedFile, selectedFileContent } = useSource();

  return (
    <main className=" h-screen w-full overflow-auto">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border "
      >
        <ResizablePanel className="min-w-[400px] bg-gray-800" defaultSize={25}>
          <div className="flex h-full items-start justify-center p-6 ">
            <NewSidebar projectId={projectId || ""} />
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className=" ">
            <MonacoEditor
              height={"100vh"}
              defaultLanguage="python"
              language="js"
              theme="vs-dark"
              value={selectedFileContent}
              onChange={(content) => {
                editSelectedFile(content ? content : "");
              }}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default Editor;
