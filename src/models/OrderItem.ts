import { prop, Ref } from "typegoose";
import { PreviewItem } from "./PreviewItem";
import { BaseObject } from "./base/BaseObject";

export class OrderItem extends BaseObject {
    @prop({ required: true }) previewItem: Ref<PreviewItem>;
    @prop() notes: string;

    constructor(previewItem: Ref<PreviewItem>, fields?: Partial<OrderItem>) {
        super(fields);
        this.previewItem = previewItem;
    }
}