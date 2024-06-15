"use client";
import Editor from "@/components/mycomponents/Editor";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <Editor />
    </Suspense>
  );
};

export default page;
