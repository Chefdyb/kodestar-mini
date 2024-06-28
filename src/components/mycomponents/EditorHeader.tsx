"use client";
import { useSource } from "@/context/NewSourceContext";
import React from "react";

import {
  FaBaseball,
  FaBowlingBall,
  FaClosedCaptioning,
  FaX,
} from "react-icons/fa6";
import { Button } from "../ui/button";
import { FileIcon, defaultStyles } from "react-file-icon";
import { IoClose } from "react-icons/io5";
import { getIconForFile } from "vscode-icons-js";

const EditorHeader = () => {
  const { openedFiles, setSelect, closeOpenedFile, selected } = useSource();
  return (
    <div className="bg-darken h-[52px] w-full  overflow-x-auto whitespace-nowrap flex items-start">
      <div className="inline-flex">
        {openedFiles.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`header-item m-0 bg-darken flex flex-col `}
              onClick={() => {
                setSelect(item.id);
              }}
            >
              <div
                className={`w-full h-[2px] ${
                  selected === item.id && "bg-red-400"
                }`}
              ></div>
              <div className="flex items-center gap-3">
                <div className="h-5 w-5">
                  <img
                    src={"/icons/" + getIconForFile(item.name)}
                    className=" h-5"
                  />
                </div>
                <div className="">{item.name}</div>
                <div >
                  <Button
                    className={`  aspect-square bg-opacity-35   hover:bg-gray-400 hover:text-gray-300 relative`}
                    variant={"ghost"}
                    onClick={(e) => {
                      closeOpenedFile(item.id);
                      e.stopPropagation();
                    }}
                  >
                    <IoClose size={18} className=" " />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EditorHeader;
