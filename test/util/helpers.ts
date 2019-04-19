import mongoose from "mongoose";
import DataAccess from "../../src/config/dataAccess";
import { ShutterlyncServer } from "../../src/index";
import ProjectRepository from "../../src/app/repositories/projectRepository";
import { Project } from "../../src/app/models/project";
import { createTestProject } from "../../src/initialization/initialization";
import { MongoMemServer } from "./mongoMemServer";

mongoose.Promise = global.Promise;

export const prepareDB = async () => {
    const mongoUri = await MongoMemServer.instance.getConnectionString();
    const conn = await DataAccess.connect(mongoUri);
    await createTestProject(1);
    return conn;
};

export const resetDB = async () => await DataAccess.mongooseConnection.db.dropDatabase();

export const prepareServer = async () => {
    try {
        return await new ShutterlyncServer().initialize();
    } catch (err) {
        console.log(err);
    }
};