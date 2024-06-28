"use client";
import { useSource } from "@/context/NewSourceContext";
import React, { useEffect } from "react";

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
import { FaCircle } from "react-icons/fa";

const EditorHeader = () => {
  const { openedFiles, setSelect, closeOpenedFile, selected } = useSource();
  useEffect(() => {
    console.log("selected changed: ", selected);
  }, [selected]);

  return (
    <div className="bg-darken h-[46px] w-full  overflow-x-auto whitespace-nowrap flex items-start">
      <div className="inline-flex">
        {openedFiles.map((item, index) => {
          return (
            <div
              key={item.id}
              className={`px-1 py-1  w-fit  h-full text-gray-200 items-center justify-center flex group/fileButton m-0 bg-darken  flex-col gap-2 cursor-pointer `}
              onClick={() => {
                setSelect(item.id);
              }}
            >
              <div
                className={`w-full h-[2px] ${
                  selected === item.id && "bg-red-400"
                }`}
              ></div>
              <div className="flex items-center gap-3 ">
                <div className="h-5 w-5">
                  <img
                    src={"/icons/" + getIconForFile(item.name)}
                    className=" h-5"
                  />
                </div>
                <div className="">{item.name}</div>
                <div className=" relative group/btn px-1">
                  <button
                    className={`opacity-0 absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 ${
                      selected === item.id
                        ? " opacity-100 group-hover:opacity-100 "
                        : " group-hover/fileButton:opacity-35 "
                    } `}
                    onClick={(e) => {
                      closeOpenedFile(item.id);
                      e.stopPropagation();
                    }}
                  >
                    <IoClose size={16} className="1 " />
                  </button>
                  {item.initContent !== item.newContent && (
                    <FaCircle
                      className={`absolute top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2 group-hover/btn:hidden ${
                        selected !== item.id && " opacity-30 "
                      }`}
                      size={12}
                    />
                  )}
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
