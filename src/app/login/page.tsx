"use client";
import { useState } from "react";
import {createDir, Dir} from "@tauri-apps/api/fs";
import {pictureDir} from "@tauri-apps/api/path"
import { signIn } from "next-auth/react";
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
import { toast } from "sonner";
import { string } from "zod";
import Lottie from "react-lottie-player";
import Animation from "@/lottifiles/Animation.json"
// Alternatively:
// import Lottie from 'react-lottie-player/dist/LottiePlayerLight'

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        const picturesPath = await pictureDir()
        const newDirName = "users"
        const fullPath = `${picturesPath}/${newDirName}`
        await createDir(fullPath, {recursive: true})
        console.log("Folder successfully created")
        // Basic client-side validation
        if (!email || !password) {
            setError("Email and password are required");
            toast.error(error);
            setLoading(false);
            return;
        }

        try {
            // Fetch the user from the database
            const user = await db.users.get({ email });

            // Check if user exists and password matches
            if (user && user.password === password) {
                toast.success("Login successful!");
                // Redirect or perform any other actions upon successful login
            } else {
                toast.error(error);
            }
        } catch (err) {
            console.error("Error fetching user:", err);
            setError(
                "An error occurred while logging in. Please try again later."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="h-screen flex items-center justify-center bg-slate-50">
            <section className="overflow-hidden border rounded-md   md:h-[70vh] flex items-center justify-center">
                <div className="h-full hidden md:block  overflow-hidden">
                    <Lottie
                        className="w-full h-full"
                        loop
                        animationData={Animation}
                        play
                    />
                </div>
                <Card className="w-full border-none shadow-none rounded-none h-full grid place-content-center max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Enter your student email below to login to your
                            account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@knust.edu.gh"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-destructive">{error}</p>}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            //@ts-ignore
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </Button>
                    </CardFooter>
                </Card>
            </section>
        </main>
    );
}
