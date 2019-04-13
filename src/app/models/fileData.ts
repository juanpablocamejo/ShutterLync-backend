import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import { Binary } from "mongodb";

export class FileData extends Typegoose {

    @prop({ required: true })
    data: Binary;
    @prop()
    contentype: String;
}