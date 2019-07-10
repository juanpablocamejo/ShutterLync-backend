import { prop } from "typegoose";
import { BaseObject } from "./base/BaseObject";

export class Client extends BaseObject {
    @prop({ required: true })
    name: string;
    @prop({ required: true })
    lastName: string;
    @prop({ required: true })
    email: string;
    @prop()
    location: string;

    constructor(fields?: Partial<Client>) {
        super(); this.init(fields);
    }
}