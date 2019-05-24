import mongoose from "mongoose";
import DataAccess from "../../src/config/dataAccess";
import { ShutterlyncServer } from "../../src/ShutterlyncServer";
import { Project } from "../../src/models/Project";
import { createTestProject } from "../../src/initialization/initialization";
import { MongoMemServer } from "./mongoMemServer";
import { BaseObject } from "../../src/models/base/BaseObject";
import { prop } from "typegoose";
import _ from "lodash";

mongoose.Promise = global.Promise;

export const prepareDB = async () => {
    const mongoUri = await MongoMemServer.instance.getConnectionString();
    const conn = await DataAccess.connect(mongoUri);
    await createTestProject(1);
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

export class AnyModelClass extends BaseObject {
    @prop()
    anyProp: any;
    @prop()
    anotherProp: any;
    constructor(fields?: Partial<AnyModelClass>) {
        super(fields);
    }
}

type RouteMap = { [key: string]: string[] };
const addRoutes = (rec: any[], elem: any) => _.assignWith(rec, elem, (obj, src) => obj ? [...obj, ...src] : [...src]);
export const getRoutes = (stack: any): RouteMap => _.reduce(stack,
    (rec: any[], { name, route, handle }: any) =>
        (name === "router") ? addRoutes(rec, getRoutes(handle.stack)) :
            ((route && typeof route.path === "string") ? addRoutes(rec, { [route.path]: Object.keys(route.methods) }) : rec)
    , {});