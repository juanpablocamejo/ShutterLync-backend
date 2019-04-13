import { Typegoose, prop, Ref, arrayProp } from "typegoose";
import _ from "lodash";
import { PreviewItem } from "./previewItem";
import { User } from "./user";
import { Order } from "./order";

export class Project extends Typegoose {
    @prop({ required: true })
    title: String;
    @prop({ ref: User })
    owner: Ref<User>;
    @prop()
    createdAt: Date;
    @arrayProp({ items: PreviewItem })
    previewItems: PreviewItem[];
    @prop()
    order: Order;
}