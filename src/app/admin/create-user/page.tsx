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
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { createUser } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

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
            await createUser(credentials.name, credentials.email, credentials.password);
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
            <div className=" h-screen flex  justify-center items-center">
                <Card className="z-30 w-full max-w-sm">
                    <form onSubmit={handleRegister}>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">
                                <div className=" w-full flex justify-around items-center ">
                                    <span>Registration</span>
                                    <Link href="/login"><Button>Login</Button></Link>
                                </div>
                            </CardTitle>
                            <CardDescription>Register to Users</CardDescription>
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
            </div>
        </>
    );
}

export default RegisterForm;
