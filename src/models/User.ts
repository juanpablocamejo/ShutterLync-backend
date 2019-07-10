import { Typegoose, prop, arrayProp, instanceMethod } from "typegoose";
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
    role: UserRole = UserRole.CLIENT;
    @prop({ required: true })
    confirmed: boolean = false;

    constructor(fields?: Partial<User>) {
        super(); this.init(fields);
        this.password = this.password || "sl*123456";
    }

    @instanceMethod
    confirm(newPassword: string) {
        this.confirmed = true;
        this.password = newPassword;
    }
}

