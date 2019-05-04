import _ from "lodash";
import fs from "fs";
import { Project } from "../models/Project";
import { PreviewItem } from "../models/PreviewItem";
import { FileData } from "../models/FileData";
import DataAccess from "../config/dataAccess";
import { Binary } from "mongodb";
import mime from "mime";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { User } from "../models/User";
import { UserRole } from "../models/enums/UserRole";

const dirPath = "../backend/samples";
const createFile = async (filename: string) => {
    const filePath = dirPath + "/" + filename;
    const img = new PreviewItem({ filename });

    const fd = new FileData();
    fd.data = new Binary(fs.readFileSync(filePath));
    fd.contentype = mime.getType(filename);
    img.fileData = (await fd.getModelForClass(FileData).create(fd))._id;
    console.log(img.filename);
    return img;
};

const uploadImages = async (project: Project, limit: number) => {
    let files = fs.readdirSync(dirPath);
    if (limit) { files = files.splice(0, limit - 1); }
    return await Promise.all(files.map((f) => createFile(f)));
};

const testProjectName = () => `Proyecto de prueba ${+new Date()}`;

export const resetDB = async () => {
    await DataAccess.mongooseConnection.db.dropDatabase();
};

export const createClient = async () => {
    const prefix = `cli_${+new Date()}`;
    const user = new User({
        role: UserRole.CLIENT,
        email: `${prefix}@gmail.com`,
        confirmed: true,
        name: `${prefix}_name`,
        lastName: `${prefix}_lastName`
    });
    const client = await user.getModelForClass(User).create(user);
    return client;
};

export const createPhotographer = async () => {
    const prefix = `pho_${+new Date()}`;
    const user = new User({
        role: UserRole.STUDIO,
        email: `${prefix}@gmail.com`,
        confirmed: true,
        name: `${prefix}_name`,
        lastName: `${prefix}_lastName`
    });
    const photographer = await user.getModelForClass(User).create(user);
    return photographer;
};

export const createTestProject = async (imgs: number = undefined) => {
    let proj = new Project();
    proj.title = testProjectName();
    proj.client = (await createClient())._id;
    proj.owner = (await createPhotographer())._id;
    const repo = new ProjectRepository();
    try {
        proj = await repo.create(proj);

        const id = proj._id;
        const items = await uploadImages(proj, imgs);
        _.forEach(items, (itm) => {
            proj.addPreviewItem.bind(proj)(itm);
        });
        const res = await repo.update(id, proj);
    } catch (error) {
        console.log(error);
    }
};


