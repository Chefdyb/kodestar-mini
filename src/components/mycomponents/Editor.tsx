"use client";
import React, {
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { Monaco, Editor as MonacoEditor } from "@monaco-editor/react";
import { useSearchParams } from "next/navigation";
import { useSource } from "@/context/NewSourceContext";
import EditorHeader from "./EditorHeader";
import { getFileObject } from "@/stores/file";

import BottomBar from "./BottomBar";

import dynamic from "next/dynamic";

const TerminalComponent = dynamic(
  () => import("./Terminal"),
  { ssr: false }
);

const NewSidebar = dynamic(
  () => import("./NewSidebar"),
  { ssr: false }
);

const Editor = () => {
  const projectId = useSearchParams().get("projectId");
  const {
    editSelectedFile,
    selectedFileContent,
    selectedFile,
    selected,
    openedFiles,
    onSave,
  } = useSource();

  const ext = useMemo(() => {
    const ext = selectedFile?.name.split(".").pop() || "js";
    const language = {
      js: "Javascript",
      py: "Python",
      ts: "Typescript",
      css: "CSS",
      html: "HTML",
      json: "JSON",
      md: "Markdown",
      xml: "XML",
      sql: "SQL",
      sh: "Shell",
      yaml: "YAML",
      yml: "YAML",
      toml: "TOML",
      php: "PHP",
      go: "Go",
      java: "Java",
      rb: "Ruby",
      rs: "Rust",
      c: "C",
      cpp: "C++",
      cs: "C#",
      swift: "Swift",
      kt: "Kotlin",
      scala: "Scala",
      perl: "Perl",
      pl: "Perl",
      lua: "Lua",
      r: "R",
      dart: "Dart",
      elixir: "Elixir",
      ex: "Elixir",
      erl: "Erlang",
      hs: "Haskell",
      scss: "SCSS",
      sass: "SASS",
      less: "LESS",
      styl: "Stylus",
      vue: "Vue",
      tsx: "TSX",
      jsx: "JSX",
      graphql: "GraphQL",
    } as Record<string, string>;
    return language[ext]?.toLowerCase() || "javascript";
  }, [selectedFile, selectedFileContent]);

  // useHotkeys("ctrl+s", () => console.log("hotkeys"), {
  //   enableOnFormTags: true,
  // });
  const btnRef = useRef<HTMLButtonElement>(null);

  /*
  
  
  terminal states and hanlders
  
  
  
  */
  const [showTerminal, setShowTerminal] = useState(true);
  const toggleTerminal = () => {
    setShowTerminal((init) => !init);
  };


  

  return (
    <main className=" h-screen w-full overflow-auto">
      <ResizablePanelGroup direction="horizontal" className="h-full  ">
        <ResizablePanel className="min-w-[400px] bg-stone-900" defaultSize={25}>
          <div className="flex h-full items-start justify-center">

              <NewSidebar projectId={projectId || ""} />

          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75}>
          <div className="h-screen flex flex-col relative ">
            <button className="hidden" onClick={onSave} ref={btnRef}>
              save
            </button>
            <EditorHeader />
            <ResizablePanelGroup direction="vertical" className="h-full  ">
              <ResizablePanel defaultSize={75}>
                {!!selectedFile ? (
                  <MonacoEditor
                    path={selectedFile.id}
                    // height={"100vh"}
                    className="flex-1"
                    onMount={(editor, monaco) => {
                      editor.addAction({
                        id: "save",
                        label: "Save",
                        keybindings: [
                          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
                        ],
                        run() {
                          btnRef.current?.click();
                        },
                      });

                      editor.addAction({
                        id: "showTerminal",
                        label: "Show/Hide Terminal",
                        keybindings: [
                          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ,
                        ],
                        run() {
                          toggleTerminal();
                        },
                      });
                    }}
                    defaultLanguage="python"
                    // key={selectedFile.id}
                    saveViewState
                    language={ext}
                    theme="vs-dark"
                    // className="bg-red-600"
                    // loading={<div className="bg-green"></div>}
                    value={selectedFileContent}
                    onChange={(content) => {
                      editSelectedFile(content ? content : "");
                    }}
                    // options={{theme:}}
                  />
                ) : (
                  <div className="flex-1 bg-stone-900 h-full flex items-center justify-center">
                    <span className="text-lg text-white font-mono">
                      No file selected
                    </span>
                  </div>
                )}
              </ResizablePanel>
              <ResizableHandle withHandle />
              <TerminalComponent
                projectId={projectId || ""}
                showTerminal={showTerminal}
              />
            </ResizablePanelGroup>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <BottomBar closeTerminal={toggleTerminal} />
    </main>
  );
};

export default Editor;
