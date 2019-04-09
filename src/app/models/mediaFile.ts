import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import { Binary } from "bson";
class MediaFile extends Typegoose {
    @prop()
    filename: String;
    @prop()
    contentype: String;
    @prop()
    data: Binary;
    @prop()
    selectedByClient: Boolean;
    @prop()
    createdAt: Date;
}

export default MediaFile;