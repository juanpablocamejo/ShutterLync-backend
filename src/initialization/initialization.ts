import ProjectRepository from "../app/repositories/projectRepository";
import fs from "fs";
import { Project } from "../app/models/project";
import { PreviewItem } from "../app/models/PreviewItem";
import { FileData } from "../app/models/FileData";
import DataAccess from "../config/dataAccess";
import { Binary } from "mongodb";
import mime from "mime";

const dirPath = "../backend/samples";
const createFile = async (filename: string) => {
    const filePath = dirPath + "/" + filename;
    const img = new PreviewItem();
    img.filename = filename;
    img.contentype = mime.getType(filename);

    const fd = new FileData();
    fd.data = new Binary(fs.readFileSync(filePath));
    fd.contentype = mime.getType(filename);
    img.fileData = (await fd.getModelForClass(FileData).create(fd))._id;
    console.log(img.filename);
    return img;
};

const loadImages = async (project: Project) => {
    const files = fs.readdirSync(dirPath);
    project.previewItems = await Promise.all(files.map(createFile));
};

const testProjectName = "Proyecto de prueba";

export const resetDB = async () => {
    await DataAccess.mongooseConnection.db.dropDatabase();
};

export const createTestProject = async () => {
    const proj = new Project();
    proj.title = testProjectName;
    const repo = new ProjectRepository();
    const id = (await repo.create(proj))._id;
    await loadImages(proj);
    await repo.update(id, proj);
};


