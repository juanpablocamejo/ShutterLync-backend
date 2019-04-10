import Project from "../app/models/project";
import ProjectRepository from "../app/repositories/projectRepository";
import fs from "fs";
import PreviewFile from "../app/models/previewFile";
import FileData from "../app/models/FileData";
import { Binary } from "mongodb";
import mime from "mime";


const errorHandler = () => console.log("error al cargar datos de pruebas");

const dirPath = "../backend/samples";
const createFile = async (filename: string) => {
    const filePath = dirPath + "/" + filename;
    const img = new PreviewFile();
    img.filename = filename;
    img.contentype = mime.getType(filename);

    const fd = new FileData();
    const fileDec: fs.Stats = fs.statSync(filePath);
    fd.data = new Binary(fs.readFileSync(filePath));
    img.fileData = (await fd.getModelForClass(FileData).create(fd))._id;
    console.log(img);
    return img;
};

const loadImages = async (project: Project) => {
    const files = fs.readdirSync(dirPath);
    project.previewFiles = await Promise.all(files.map(createFile));
};
export const createTestProject = async () => {
    const proj = new Project();
    proj.title = "Proyecto de prueba";
    await new Project().getModelForClass(Project).findOneAndRemove(
        {title: proj.title}
    ).exec();
    console.log("creando proyecto de prueba");
    const repo = new ProjectRepository();
    const id = (await repo.create(proj))._id;
    await loadImages(proj);
    repo.update(id, proj);
};


