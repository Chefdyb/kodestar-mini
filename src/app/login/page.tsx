"use client";
import { useState } from "react";
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
import Animation from "@/lottifiles/Animation.json";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        // Basic client-side validation
        if (!email || !password) {
            setError("Email and password are required");
            toast.error("Email and password are required");
            setLoading(false);
            return;
        }

        try {
            // Fetch the user from the database
            const user = await db.users.get({ email });
            user && console.log(user);

            // Check if user exists and password matches
            if (user && user.password === password) {
                toast.success("Login successful!");
                // redirect to editor page
                sessionStorage.setItem(
                    "auth-session-kodestar",
                    JSON.stringify(user.id)
                );
                router.push("/home");
            } else {
                toast.error(`Invalid email or password`);

                return;
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
        <main className="  h-screen flex items-center justify-center bg-slate-50">
            <section className="overflow-hidden relative border rounded-md   md:h-[70vh] flex items-center justify-center">
                <Link href="/admin/create-user" className=" absolute top-4 right-10 ">
                    <Button variant={"secondary"}>Register</Button>
                </Link>
                <div className="h-full hidden md:block  overflow-hidden">
                    <Lottie
                        className="w-full h-full"
                        loop
                        animationData={Animation}
                        play
                    />
                </div>
                <Card className="w-full  border-none shadow-none rounded-none h-full grid place-content-center max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            <div className=" w-full flex justify-start">
                                <span>Login</span>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            Enter your student email and password below to login
                            to your IDE.
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
