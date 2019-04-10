import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import _ from "lodash";
import { Types } from "mongoose";
import PreviewFile from "./previewFile";
import User from "./user";
class Project extends Typegoose {
    @prop({ required: true })
    title: String;
    @prop({ ref: User })
    owner: Ref<User>;
    @prop()
    createdAt: Date;
    @arrayProp({ items: PreviewFile })
    previewFiles: PreviewFile[];

}

export default Project;
