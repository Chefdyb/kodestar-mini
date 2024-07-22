"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import { Event, listen } from "@tauri-apps/api/event";

// import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { invoke } from "@tauri-apps/api";
import { appDataDir } from "@tauri-apps/api/path";
import { ResizablePanel } from "@/components/ui/resizable";
import { getUser } from "@/lib/utils";
import { type } from "@tauri-apps/api/os";
import { Terminal } from "@xterm/xterm";

const TerminalComponent = ({
  projectId,
  showTerminal,
}: {
  projectId: string;
  showTerminal: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const fitTerminal = async () => {
    fitAddon.fit();

    console.log("Resizing terminal");
    console.log(term.rows, term.cols);
    await invoke("resize_pty", {
      rows: term.rows,
      cols: term.cols,
    });
  };



  const writeToPty = (data: string) => {
    void invoke("write_to_pty", {
      data,
    });
  };

  const term = new Terminal({
    theme: {
      background: "rgb(47, 47, 47)",
    },
  });
  // useLayoutEffect(() => {
  //   return;
  //   if (!terminalRef.current) return;

  //   const fitAddon = new FitAddon();

  //   term.loadAddon(fitAddon);
  //   term.open(terminalRef.current);
  //   fitAddon.fit();

  //   termRef.current = term;
  //   fitAddonRef.current = fitAddon;

  //   term.onData(writeToPty);
  //   window.addEventListener("resize", fitTerminal);

  //   const readFromPty = async () => {
  //     const data = await invoke<string>("async_read_from_pty");
  //     if (data) {
  //       await writeToTerminal(data);
  //     }
  //     window.requestAnimationFrame(readFromPty);
  //   };

  //   window.requestAnimationFrame(readFromPty);
  //   initShell();

  //   const init = async () => {
  //     if (termRef.current) {
  //       const osType = await type();
  //       if (loading) return;

  //       const appDataDirPath = await appDataDir();
  //       const { id } = await getUser();
  //       const projectPath =
  //         appDataDirPath +
  //         (osType === "Windows_NT"
  //           ? `databases\\user_projects\\${id}\\${projectId}\\`
  //           : `databases/user_projects/${id}/${projectId}/`);

  //       // const formatted = projectPath.replace(/\//g, "\\");

  //       writeToPty(`cd "${projectPath}" \n\n`);
  //       writeToPty(`clear \n`);
  //       setLoading(true);
  //       clearInterval(interval);
  //     }
  //   };

  //   const interval = setInterval(init, 100);

  //   console.count("Terminal init");

  //   return () => {
  //     term.dispose();

  //     window.removeEventListener("resize", fitTerminal);
  //     clearInterval(interval);
  //   };
  // }, [writeToPty, fitTerminal, initShell, loading, projectId]);

  const fitAddon = new FitAddon();
  useEffect(() => {
    if (terminalRef.current) {
      console.log("in terminal");
      // term.loadAddon(new WebLinksAddon());
      fitAddon.fit();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);

      // Invoke async_shell command to create the shell process
      invoke("async_shell").catch((error) => {
        console.error("Error creating shell:", error);
      });
      fitTerminal();
    }
  }, []);

  termRef.current = term;
  fitAddonRef.current = fitAddon;

  term.onData(writeToPty);
  const writeToTerminal = (ev: Event<string>) => {
    term.write(ev.payload);
  };

  listen("data", writeToTerminal);

  return (
    <ResizablePanel
      defaultSize={75}
      className="bg-gray-600 bottom-0 left-0 w-full"
      onResize={fitTerminal}
      style={{
        display: showTerminal ? "block" : "hidden",
      }}
    >
      <div
        id="terminal"
        ref={terminalRef}
        style={{ width: "100%", height: "100%" }}
      ></div>
    </ResizablePanel>
  );
};

export default TerminalComponent;
