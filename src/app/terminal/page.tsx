"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useRef,
  useCallback,
  useState,
} from "react";
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

  const fitTerminal = useCallback(async () => {
    if (fitAddonRef.current && termRef.current) {
      fitAddonRef.current.fit();
      console.log("rows, cols: ", termRef.current.rows, termRef.current.cols);
      await invoke("async_resize_pty", {
        rows: termRef.current.rows,
        cols: termRef.current.cols,
      });
    }
  }, []);

  const writeToTerminal = useCallback((data: string): Promise<void> => {
    return new Promise((resolve) => {
      termRef.current?.write(data, resolve);
    });
  }, []);

  const writeToPty = useCallback((data: string) => {
    invoke("async_write_to_pty", { data });
  }, []);

  const initShell = useCallback(() => {
    invoke("async_create_shell").catch((error: unknown) => {
      console.error("Error creating shell:", error);
    });
  }, []);

  useLayoutEffect(() => {
    if (!terminalRef.current) return;

    const fitAddon = new FitAddon();
    const term = new Terminal({
      theme: {
        background: "rgb(47, 47, 47)",
      },
    });

    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    fitAddon.fit();

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    term.onData(writeToPty);
    window.addEventListener("resize", fitTerminal);

    const readFromPty = async () => {
      const data = await invoke<string>("async_read_from_pty");
      if (data) {
        await writeToTerminal(data);
      }
      window.requestAnimationFrame(readFromPty);
    };

    window.requestAnimationFrame(readFromPty);
    initShell();

    const init = async () => {
      if (termRef.current) {
        const osType = await type();
        if (loading) return;

        const appDataDirPath = await appDataDir();
        const { id } = await getUser();
        const projectPath =
          appDataDirPath +
          (osType === "Windows_NT"
            ? `databases\\user_projects\\${id}\\${projectId}\\`
            : `databases/user_projects/${id}/${projectId}/`);

        const formatted = projectPath.replace(/\//g, "\\");

        console.log(formatted);
        writeToPty(`cd ${formatted} \n\n`);
        setLoading(true);
        clearInterval(interval);
      }
    };

    const interval = setInterval(init, 100);

    console.count("Terminal init");

    return () => {
      term.dispose();
      window.removeEventListener("resize", fitTerminal);
      clearInterval(interval);
    };
  }, [writeToPty, fitTerminal, initShell, loading, projectId]);

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
