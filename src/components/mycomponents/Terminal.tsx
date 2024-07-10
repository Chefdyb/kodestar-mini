import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { invoke } from "@tauri-apps/api";
import { useEffect, useRef, useState } from "react";

const TerminalComponent = () => {
  const [loading, setLoading] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef(
    new Terminal({
      fontFamily: "Jetbrains Mono",
      theme: {
        background: "rgb(47, 47, 47)",
      },
    })
  ).current;
  const fitAddon = useRef(new FitAddon()).current;

  useEffect(() => {
    if (!terminalRef.current) {
      return;
    }

    term.loadAddon(fitAddon);
    term.open(terminalRef.current);

    const fitTerminal = async () => {
      fitAddon.fit();
      await invoke<string>("async_resize_pty", {
        rows: term.rows,
        cols: term.cols,
      });
    };

    const writeToTerminal = (data: string) => {
      return new Promise<void>((resolve) => {
        term.write(data, () => resolve());
      });
    };

    const writeToPty = (data: string) => {
      invoke("async_write_to_pty", { data });
    };

    const initShell = () => {
      invoke("async_create_shell").catch((error) => {
        console.error("Error creating shell:", error);
      });
    };

    initShell();
    term.onData(writeToPty);
    window.addEventListener("resize", fitTerminal);
    fitTerminal();

    const readFromPty = async () => {
      const data = await invoke<string>("async_read_from_pty");
      if (data) {
        await writeToTerminal(data);
      }
      window.requestAnimationFrame(readFromPty);
    };

    window.requestAnimationFrame(readFromPty);

    return () => {
      term.dispose();
      window.removeEventListener("resize", fitTerminal);
    };
  }, [term, fitAddon]);

  return <div id="terminal" ref={terminalRef}></div>;
};

export default TerminalComponent;
