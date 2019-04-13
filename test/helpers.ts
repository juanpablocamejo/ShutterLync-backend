import mongoose from "mongoose";
import { Mockgoose } from "mockgoose";
import DataAccess from "../src/config/dataAccess";
import { ShutterlyncServer } from "../src/index";
import { createTestProject } from "../src/initialization/initialization";
import ProjectRepository from "../src/app/repositories/projectRepository";
import { Project } from "../src/app/models/project";

const mockgoose = new Mockgoose(mongoose);
mongoose.Promise = global.Promise;

export const prepareDB = async () => {
    await mockgoose.prepareStorage();
    await DataAccess.mongooseInstance;
    const proj = new Project();
    proj.title = "Proyecto de prueba";
    const repo = new ProjectRepository();
    const id = (await repo.create(proj))._id;
};

export const resetDB = async () => mockgoose.helper.reset();

export const prepareServer = async () => {
    try {

        await mockgoose.prepareStorage();
        return await new ShutterlyncServer().initialize();
    } catch (err) {
        console.log(err);
    }
};