import _, { Dictionary } from "lodash";
import fs from "fs";
import { Project } from "../models/Project";
import { PreviewItem } from "../models/PreviewItem";
import { FileData } from "../models/FileData";
import DataAccess from "../config/dataAccess";
import { Binary, ObjectId } from "mongodb";
import mime from "mime";
import { ProjectRepository } from "../repositories/ProjectRepository";
import { User } from "../models/User";
import { UserRole } from "../models/enums/UserRole";
import { Client } from "../models/Client";
import { UserService } from "../services/UserService";
import { Ref } from "typegoose";

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

class IdGenerator {
    private static ids: Dictionary<number> = {};

    public static get(key: string) {
        if (!this.ids[key]) {
            this.ids[key] = 1;
            return 1;
        }
        else {
            return ++this.ids[key];
        }
    }
}

export const createClient = async (password: string) => {
    const prefix = `cli_${IdGenerator.get("client")}`;
    const client = new Client({
        email: `${prefix}@gmail.com`,
        name: `${prefix}_name`,
        lastName: `${prefix}_lastName`,
        location: `${prefix}_location`
    });
    await createClientUser(client, password);
    return client;
};

export const createPhotographer = async (password?: string) => {
    const prefix = `pho_${IdGenerator.get("photographer")}`;
    const user = new User({
        role: UserRole.STUDIO,
        email: `${prefix}@gmail.com`,
        confirmed: true,
        name: `${prefix}_name`,
        lastName: `${prefix}_lastName`,
        location: `${prefix}_location`,
        password: password || "pho123456",
    });

    return await new UserService().create(user);
};

export const createClientUser = async (cli: Client, password: string) => {
    const { email, name, lastName, location } = cli;
    const user = new User({
        role: UserRole.CLIENT,
        email,
        confirmed: true,
        name,
        lastName,
        location,
        password: password || "cli123456"
    });
    return await new UserService().create(user);
};

export const createTestProject = async (imgs: number = undefined, defaultPassword?: string, owner?: Ref<User>, client?: Client) => {
    let proj = new Project({
        title: testProjectName(),
        client: client ? client : await createClient(defaultPassword),
        owner: owner ? owner : await createPhotographer(defaultPassword),
        date: new Date(),
        notes: "project notes",
        quantity: 100,
        aditionalItemPrice: 85,
        quotation: 24000
    });

    const repo = new ProjectRepository();
    try {
        proj = await repo.create(proj);

        const id = proj._id;
        const items = await uploadImages(proj, imgs);
        _.forEach(items, (itm) => {
            proj.addPreviewItem.bind(proj)(itm);
        });
        const res = await repo.update(id, proj);
        return proj;
    } catch (error) {
        console.log(error);
    }
};


