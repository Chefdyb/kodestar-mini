import Dexie, { Table } from "dexie";
export interface User {
    id: string;
    email: string;
    name: string;
    password: string;
}
export interface Project {
    id: string;
    userID: string
    createdAt: Date;
    modifiedAt: Date;
    name: string;
    cloudSynced: boolean;
    primaryLanguage: string;
}
export interface Settings {
    id: string;
    userID: string;
    theme: "Light" | "Dark";
    cloudSyncActive: boolean;
    modifiedAt: Date;
}
class Kodestar extends Dexie {
    users!: Table<User>;
    projects!: Table<Project>;
    settings!: Table<Settings>;

    constructor() {
        super("Kodestar");
        this.version(1).stores({
            // Define schema for users table
            users: "&id, name, &email, password",
            projects: "&id, userID, createdAt, modifiedAt, name, primaryLanguage",
            settings: "&id, userID, theme, cloudSyncActive",
        });

        this.users = this.table("users");
        this.projects = this.table("projects");
    }
}

const db = new Kodestar();
export default db;
