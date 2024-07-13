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

function RegisterForm() {
    const router = useRouter();
    function handleToast(e: React.FormEvent) {
        e.preventDefault();
        console.log("first");
        toast.success("User created successfully");
    }

    const [credentials, setCredentials] = useState({
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
                email: prev.email.trim(),
                password: prev.password,
            };
        });
        try {
            toast.success("User created successfully");
            setCredentials({
                email: "",
                password: "",
            });
            await createUser(credentials.email, credentials.password);
            router.push("/admin/create-user");
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
            <div className="grid h-screen  w-screen place-content-center">
                <Card className="z-30 w-full max-w-sm">
                    <form onSubmit={handleToast}>
                        <CardHeader>
                            <CardTitle className="text-center text-2xl">
                                Register
                            </CardTitle>
                            <CardDescription>Register to Users</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="isaacquan"
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
