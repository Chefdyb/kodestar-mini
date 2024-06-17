"use client";
import { useSource } from "@/context/NewSourceContext";
import React from "react";

import { FaBowlingBall, FaX } from "react-icons/fa6";
import { Button } from "../ui/button";
import { FileIcon, defaultStyles } from "react-file-icon";

const EditorHeader = () => {
  const { openedFiles, setSelect, closeOpenedFile } = useSource();
  return (
    <div className="bg-darken h-12 flex overflow-x-auto gap-0">
      {openedFiles.map((item, index) => {
        return (
          <div
            className="header-item m-0 bg-darken border-0"
            onClick={() => {
              setSelect(item.id);
            }}
          >
            <FileIcon extension="docx" {...defaultStyles.docx} />;
            <div className="">{item.name}</div>
            <Button
              className=" aspect-square bg-opacity-35 opacity-0 p-0 h-5 hover:bg-gray-400 hover:text-gray-300"
              variant={"ghost"}
              onClick={(e) => {
                closeOpenedFile(item.id);
                e.stopPropagation();
              }}
            >
              {item.initContent === item.newContent ? (
                <FaX />
              ) : (
                <FaBowlingBall />
              )}
            </Button>
          </div>
        );
      })}
    </div>
  );
};

export default EditorHeader;
