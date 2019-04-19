import { MongoMemoryServer } from "mongodb-memory-server";

export class MongoMemServer {
    private static _instance: MongoMemoryServer;

    public static get instance(): MongoMemoryServer {
        return this._instance || this.create();
    }

    private static create(): MongoMemoryServer {
        this._instance = new MongoMemoryServer();
        return this.instance;
    }
}