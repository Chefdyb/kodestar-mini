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
import NewSidebar from "./NewSidebar";
import { useSource } from "@/context/NewSourceContext";
import EditorHeader from "./EditorHeader";
import { getFileObject } from "@/stores/file";

import { writeFile } from "@/helpers/filesys";

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
  const [showTerminal, setShowTerminal] = useState(false);
  const toggleTerminal = () => {
    setShowTerminal((init) => !init);
  };

  return (
    <main className=" h-screen w-full overflow-auto">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-full rounded-lg border "
      >
        <ResizablePanel className="min-w-[400px] bg-darken" defaultSize={25}>
          <div className="flex h-full items-start justify-center p-6 ">
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
            {!!selectedFile ? (
              <MonacoEditor
                path={selectedFile.id}
                // height={"100vh"}
                className="flex-1"
                onMount={(editor, monaco) => {
                  editor.addAction({
                    id: "save",
                    label: "Save",
                    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS],
                    run() {
                      btnRef.current?.click();
                    },
                  });
                  editor.addAction({
                    id: "showTerminal",
                    label: "Show/Hide Terminal",
                    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyJ],
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

                value={selectedFileContent}
                onChange={(content) => {
                  editSelectedFile(content ? content : "");
                }}
                // options={{theme:}}
              />
            ) : (
              <div>No file selected</div>
            )}
            <div className="h-40 bg-green-400 thatthing absolute bottom-0 left-0 w-full"></div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
};

export default Editor;
