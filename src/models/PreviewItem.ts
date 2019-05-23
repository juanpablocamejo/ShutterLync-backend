import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import { FileData } from "./FileData";
import { BaseObject } from "./base/BaseObject";

export class PreviewItem extends BaseObject {
    @prop({ required: true })
    filename: string;
    @prop({ required: true, ref: FileData })
    fileData: Ref<FileData>;

    constructor(fields?: Partial<PreviewItem>) {
        super(fields);
    }
}