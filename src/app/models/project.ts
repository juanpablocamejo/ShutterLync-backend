import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import MediaFile from "./mediaFile";
class Project extends Typegoose {
    @prop()
    name: String;
    @prop()
    createdAt: Date;
    @arrayProp({ itemsRef: MediaFile })
    mediaFiles: Ref<MediaFile>[];
}

export default Project;