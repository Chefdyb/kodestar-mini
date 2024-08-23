import {
    GlassCard,
    GlassCardContent,
} from "@/components/mycomponents/GlassCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
    return (
        <div className="h-screen  bg-stone-800 flex items-center justify-center text-gray-300 font-mono text-xl">
            <div className="absolute top-2 left-2">admin</div>
            <div className="flex  gap-3">
                <a href="/admin/create-user">
                    <GlassCard className="w-56 aspect-square flex items-center justify-center bg-yellow-800 hover:bg-yellow-800/60 cursor-pointer">
                        <GlassCardContent>Create user</GlassCardContent>
                    </GlassCard>
                </a>
                <a href="/admin/change-user-password">
                    <GlassCard className="w-56 aspect-square flex items-center justify-center bg-yellow-800 hover:bg-yellow-800/60 cursor-pointer">
                        <GlassCardContent className="text-center">
                            Change User Password
                        </GlassCardContent>
                    </GlassCard>
                </a>
            </div>
            <a className="absolute bottom-2 right-2" href="/">
                home
            </a>
        </div>
    );
};

export default Page;
