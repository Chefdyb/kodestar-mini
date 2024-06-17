"use client";
import Editor from "@/components/mycomponents/Editor";
import { SourceProvider } from "@/context/NewSourceContext";
import React, { Suspense } from "react";

const page = () => {
  return (
    <SourceProvider>
      <Suspense fallback={<div>Loading</div>}>
        <Editor />
      </Suspense>
    </SourceProvider>
  );
};

export default page;
