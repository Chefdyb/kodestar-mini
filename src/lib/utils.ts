import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// create a wrapper to add users to the database

import db from "@/lib/db";
// import { randomUUID } from "crypto";
import { v4 as uuid } from "uuid";
import { User } from "@/lib/db";
import { toast } from "sonner";

export async function createUser(name: string, email: string, password: string) {
    const user: User = {
        name,
        email,
        password,
        id: uuid(),
    };

    await db.users.add(user);
}
