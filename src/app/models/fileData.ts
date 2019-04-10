import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import { Binary } from "mongodb";
class FileData extends Typegoose {

    @prop({ required: true })
    data: Binary;
}

export default FileData;