"use client";
import Sidebar from "@/components/mycomponents/Sidebar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Editor } from "@monaco-editor/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const dev: string = "Edwin"; //write you naem here
  switch (dev) {
    case "Ato":
      router.push("/login");
      break;
    case "Edwin":
      router.push("/login");
      break;
    default:
      router.push("/");
      break;
  }

  return (
    <main className=" h-screen w-full overflow-auto">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border "
      >
        <ResizablePanel className="min-w-[400px]" defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6 ">
            <Sidebar />
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
