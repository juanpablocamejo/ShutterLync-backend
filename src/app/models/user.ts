import { Typegoose, prop, arrayProp } from "typegoose";

enum Role {
    Client = "CLIENT",
    Studio = "STUDIO"
}
class User extends Typegoose {
    @prop()
    name: String;
    @prop()
    createdAt: Date;
    @prop()
    confirmed: Boolean;
    @prop()
    lastName: String;
    @prop()
    email: String;
    @prop()
    password: String;
    @prop()
    roles: Role[];
}
export default User;