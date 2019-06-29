import mongoose from "mongoose";
import DataAccess from "../../src/config/dataAccess";
import { ShutterlyncServer } from "../../src/ShutterlyncServer";
import { Project } from "../../src/models/Project";
import { createTestProject } from "../../src/initialization/initialization";
import { MongoMemServer } from "./mongoMemServer";
import { BaseObject } from "../../src/models/base/BaseObject";
import { prop, Ref } from "typegoose";
import _ from "lodash";
import { UserController } from "../../src/controllers/UserController";
import { UserRepository } from "../../src/repositories/UserRepository";
import { User } from "../../src/models/User";
import { UserQueryDto } from "../../src/dto/UserQueryDto";
import { ProjectRepository } from "../../src/repositories/ProjectRepository";
mongoose.Promise = global.Promise;


export const validPassword = () => "0q38974gahoiugh4e0g";

export const prepareDB = async () => {
    const mongoUri = await MongoMemServer.instance.getConnectionString();
    const conn = await DataAccess.connect(mongoUri);
    const proj1 = await createTestProject(1, validPassword());
    await createTestProject(1, validPassword(), proj1.owner, proj1.client);
    const proj2 = await createTestProject(1, validPassword());
    await createTestProject(1, validPassword(), proj2.owner, proj2.client);
    return conn;
};

export const getUserToken = (user: User) => {
    return new UserController().getAuthDto(user).token;
};

export const resetDB = async () => await DataAccess.mongooseConnection.db.dropDatabase();

export const prepareServer = async () => {
    try {
        return await new ShutterlyncServer().initialize();
    } catch (err) {
        console.log(err);
    }
};

export class AnyModelClass extends BaseObject {
    @prop()
    anyProp: any;
    @prop()
    anotherProp: any;
    arrayProp: any[];
    objProp: AnyModelClass;
    propWithDefValue1: any = 1;
    constructor(fields?: Partial<AnyModelClass>) {
        super(fields);
        this.init(fields);
    }
}

type RouteMap = { [key: string]: string[] };
const addRoutes = (rec: any[], elem: any) => _.assignWith(rec, elem, (obj, src) => obj ? [...obj, ...src] : [...src]);
export const getRoutes = (stack: any): RouteMap => _.reduce(stack,
    (rec: any[], { name, route, handle }: any) =>
        (name === "router") ? addRoutes(rec, getRoutes(handle.stack)) :
            ((route && typeof route.path === "string") ? addRoutes(rec, { [route.path]: Object.keys(route.methods) }) : rec)
    , {});