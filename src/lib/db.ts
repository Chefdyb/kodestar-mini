import Dexie, { Table } from "dexie";
export interface User {
    id?: string;
    email: string;
    password: string;
}
class Kodestar extends Dexie {
    users!: Table<User>;

    constructor() {
        super("Kodestar");
        this.version(1).stores({
            users: "&id, &email, password", // Define schema for users table
        });

        this.users = this.table("users");
    }
}

const db = new Kodestar();
export default db;
