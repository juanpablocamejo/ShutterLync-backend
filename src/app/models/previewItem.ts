import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import { FileData } from "./fileData";

export class PreviewItem extends Typegoose {
    @prop()
    filename: String;
    @prop({ ref: FileData })
    fileData: Ref<FileData>;
    @prop()
    contentype: String;
    @prop()
    selectedByClient: Boolean;
    @prop()
    createdAt: Date;
}