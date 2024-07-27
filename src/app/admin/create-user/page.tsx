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
import { createDir, BaseDirectory } from "@tauri-apps/api/fs";
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
      const res = await createUser(
        credentials.name,
        credentials.email,
        credentials.password
      );
      await createDir("databases/user_projects/" + res, {
        dir: BaseDirectory.AppData,
        recursive: true,
      });

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
    <main className="  h-screen flex items-center justify-center bg-stone-800 ">
      <section className=" relative  rounded-md   flex items-center justify-center  max-w-4xl w-full gap-20 ">
        {/* <Link href="/admin/create-user" className=" absolute top-4 right-10 ">
        <Button variant={"secondary"}>Register</Button>
      </Link> */}
        <div className="h-full hidden md:block flex-1 ">
          <Lottie
            className="w-full h-full"
            loop
            animationData={Animation}
            play
          />
        </div>
        <div className="flex-1 relative">
          <div className="flex justify-end pb-4 pr-4 ">
            <a href="/login">
              <div className="text-right text-gray-300 font-bold group  relative  cursor-pointer">
                login
                <div className="h-[2px] bg-yellow-900 w-0 group-hover:w-full transition-all duration-700"></div>
              </div>
            </a>
          </div>
          <form
            className="flex-1 font-mono flex flex-col justify-between  text-center  h-full gap-16 bg-yellow-800/10 p-10 rounded-3xl"
            onSubmit={handleRegister}
          >
            <h1 className="font-bold text-yellow-500 text-3xl">
              Register User
            </h1>
            <div className="flex flex-col gap-6 ">
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-left text-lg  font-bold text-gray-400"
                >
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Maame Yaa"
                  value={credentials.name}
                  onChange={handleInputChange}
                  required
                  className="focus:border-yellow-500/60 border-gray-400 font-semibold text-lg py-6 px-4 border text-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-left text-lg  font-bold text-gray-400"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@knust.edu.gh"
                  value={credentials.email}
                  onChange={handleInputChange}
                  required
                  className="focus:border-yellow-500/60 border-gray-400 font-semibold text-lg py-6 px-4 border text-gray-300"
                />
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="password"
                  className="text-left text-lg  font-bold text-gray-300"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  className="focus:border-yellow-500/60 border-gray-400 font-semibold text-lg py-6 px-4 border text-gray-300"
                  onChange={handleInputChange}
                  required
                />
              </div>
              {/* {error && <p className="text-destructive">{error}</p>} */}
            </div>
            <Button
              className="w-full p-6 text-lg font-medium bg-yellow-700 hover:bg-yellow-700/70 "
              //@ts-ignore
              //   onClick={handleSubmit}
              // disabled={loading}
            >
              {/* {loading ? "Signing in..." : "Sign in"} */}
              Register
            </Button>
          </form>
        </div>
      </section>
    </main>
  );

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
            <Link href="/login" className=" absolute top-4 right-10">
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
        </section>
      </div>
    </>
  );
}

export default RegisterForm;
