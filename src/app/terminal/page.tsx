"use client";

import React, {
    useEffect,
    useLayoutEffect,
    useRef,
    useCallback,
    useState,
} from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { invoke } from "@tauri-apps/api";
import { appDataDir } from "@tauri-apps/api/path";
import { ResizablePanel } from "@/components/ui/resizable";

const TerminalComponent = ({ projectId }: { projectId: string }) => {
    const [loading, setLoading] = useState(false);
    const terminalRef = useRef<HTMLDivElement | null>(null);
    const termRef = useRef<Terminal | null>(null);
    const fitAddonRef = useRef<FitAddon | null>(null);

    const fitTerminal = useCallback(async () => {
        if (fitAddonRef.current && termRef.current) {
            fitAddonRef.current.fit();
            console.log(
                "rows, cols: ",
                termRef.current.rows,
                termRef.current.cols
            );
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
        invoke("async_create_shell").catch((error: unknown) => {});

        try {
        } catch (error) {
            console.error("Error creating shell:", error);
        }
    }, []);

    useLayoutEffect(() => {
        if (!terminalRef.current) return;

        const fitAddon = new FitAddon();
        const term = new Terminal({
            // fontFamily: "Jetbrains Mono",
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
                // Send 'cd' command to the PTY directly
                if (loading) return;

                const appDataDirPath = await appDataDir();

                const projectPath =
                    appDataDirPath +
                    "databases/user_projects/divquan/" +
                    projectId +
                    "/";
                const formatted = projectPath.replace(/ /g, "\\ ");

                console.log(projectPath, formatted);

                writeToPty(`cd ${formatted}\n`);
                setLoading(true);
                clearInterval(interval);
            }
        };
        // Ensure terminal is fully initialized before sending the cd command
        const interval = setInterval(() => {
            init();
        }, 100);

        return () => {
            term.dispose();
            window.removeEventListener("resize", fitTerminal);
        };
    }, []);

    return (
        <ResizablePanel
            defaultSize={75}
            className=" bg-gray-600  bottom-0 left-0 w-full"
            onResize={fitTerminal}
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
