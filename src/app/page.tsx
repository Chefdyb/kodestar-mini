"use client";

import { Button } from "@/components/ui/button";
import Animation from "@/lottifiles/welcome.json";
import { useRouter } from "next/navigation";
import Lottie from "react-lottie-player";

export default function Home() {
  const router = useRouter();
  return (
    <main className=" h-screen w-full overflow bg-stone-800 flex flex-col items-center justify-center">
      <div className="justify-center items-center flex flex-col relative">
        <Lottie
          className="max-w-xl h-full "
          loop
          animationData={Animation}
          play
        />
        <Button
          className="bg-yellow-800 hover:bg-yellow-800/60 px-20 py-10 text-2xl font-mono bottom-10"
          onClick={() => {
            router.push("/login");
          }}
        >
          {" "}
          Get Started
        </Button>
      </div>
    </main>
  );
}
