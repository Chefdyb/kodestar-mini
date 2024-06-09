"use client"
import { useState } from "react";
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


export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

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
            <section className="overflow-hidden border rounded-md shadow-md px-4 py-5 h-[70vh] flex items-center justify-center gap-2">
                <div className="h-full rounded-md overflow-hidden">
                    <img
                        className="bg-contain  h-full w-full"
                        src="/images/loginImage.png"
                        alt="Login Image"
                    />
                </div>
                <Card className="w-full h-full grid place-content-center max-w-sm">
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
