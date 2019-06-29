import { prop } from "typegoose";
import { Binary } from "mongodb";
import { BaseObject } from "./base/BaseObject";

export class FileData extends BaseObject {
    @prop({ required: true })
    data: Binary;
    @prop({ required: true })
    contentype: string;

    constructor(fields?: Partial<FileData>) {
        super(); this.init(fields);

    }
}