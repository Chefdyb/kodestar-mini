"use client";
import Editor from "@/components/mycomponents/Editor";
import { SourceProvider } from "@/context/NewSourceContext";
import { useSearchParams } from "next/navigation";
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
