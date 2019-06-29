import { Typegoose, prop, arrayProp } from "typegoose";
import { BaseObject } from "./base/BaseObject";
import { UserRole } from "./enums/UserRole";

export class User extends BaseObject {
    @prop({ required: true })
    name: string;
    @prop({ required: true })
    lastName: string;
    @prop({ required: true, unique: true })
    email: string;
    @prop()
    location: string;
    @prop()
    password: string;
    @prop({ enum: UserRole })
    role: UserRole;
    @prop({ required: true })
    confirmed: boolean;

    constructor(fields?: Partial<User>) {
        super(); this.init(fields);
    }
}

