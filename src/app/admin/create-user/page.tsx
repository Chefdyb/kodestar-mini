"use client";

import { Button } from "@/components/ui/button";
import db from "@/lib/db";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Animation from "@/lottifiles/Animation.json";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { createUser } from "@/lib/utils";
import { toast } from "sonner";
import { createDir, BaseDirectory } from '@tauri-apps/api/fs';
import Link from "next/link";
import Lottie from "react-lottie-player";

function RegisterForm() {
    const router = useRouter();

    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleInputChange = (e: any) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        
        e.preventDefault();
        

        

        setCredentials((prev) => {
            return {
                name: prev.name.trim(),
                email: prev.email.trim(),
                password: prev.password,
            };
        });
        try {
            toast.success("User created successfully");
            setCredentials({
                email: "",
                password: "",
                name: "",
            });
          const res=  await createUser(credentials.name, credentials.email, credentials.password);
          await createDir('databases/user_projects/'+res, { dir: BaseDirectory.AppData, recursive: true });

            router.push("/login");
        } catch (error: string | any) {
            if (
                error.message.includes("Unable to add key to index") &&
                error.name === "ConstraintError"
            ) {
                toast.error("Email is already been used");
                console.error("Email is already been used");
                return;
            }
            toast.error("An error occurred while creating user", error);
        }
    };

    return (
        <>
            <div className=" h-screen flex items-center justify-center bg-slate-50">
                <section className=" overflow-hidden border rounded-md md:h-[70vh] flex pb-20 items-center justify-center">
                    <div className="h-full hidden md:block  overflow-hidden">
                        <Lottie
                            className="w-full h-full"
                            loop
                            animationData={Animation}
                            play
                        />
                    </div>
                    <Card className=" h-full pt-10   relative border-none outline-none rounded-none w-full max-w-sm">
                        <Link
                            href="/login"
                            className=" absolute top-4 right-10"
                        >
                            <Button className="" variant={"secondary"}>
                                Login
                            </Button>
                        </Link>
                        <form onSubmit={handleRegister}>
                            <CardHeader>
                                <CardTitle className="text-center text-2xl">
                                    <div className=" w-full  flex justify-start">
                                        <span>Registration</span>
                                    </div>
                                </CardTitle>
                                <CardDescription>
                                    Register to Users
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Maame Yaa"
                                        required
                                        value={credentials.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="yaa@gmail.com"
                                        required
                                        value={credentials.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={credentials.password}
                                        required
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className=" flex flex-col gap-2">
                                <Button type="submit" className="w-full ">
                                    Register
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </section>
            </div>
        </>
    );
}

export default RegisterForm;
