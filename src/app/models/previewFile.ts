import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import FileData from "./fileData";

class PreviewFile extends Typegoose {
    @prop()
    filename: String;
    @prop()
    contentype: String;
    @prop({ref: FileData})
    fileData: Ref<FileData>;
    @prop()
    selectedByClient: Boolean;
    @prop()
    createdAt: Date;
}

export default PreviewFile;