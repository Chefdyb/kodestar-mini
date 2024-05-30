"use client"
import Sidebar from "@/components/ui/mycomponents/Sidebar";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Editor } from "@monaco-editor/react";

export default function Home() {
  return (
      <main className=" h-screen w-full overflow-auto">
          <ResizablePanelGroup
              direction="horizontal"
              className="h-full rounded-lg border"
          >
              <ResizablePanel defaultSize={25}>
                  <div className="flex h-full items-center justify-center p-6">
                       <Sidebar/>
                  </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={75}>
                  <div className=" ">
                      <Editor
                        
                        height={"100vh"}
                        defaultLanguage="python"
                        language="python"
                        theme="vs-dark"
                      />
                  </div>
              </ResizablePanel>
          </ResizablePanelGroup>
      </main>
  );
}
