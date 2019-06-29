import { prop, Ref } from "typegoose";
import { PreviewItem } from "./PreviewItem";
import { BaseObject } from "./base/BaseObject";

export class OrderItem extends BaseObject {
    @prop({ required: true }) previewItem: Ref<PreviewItem>;
    @prop() notes: string;
    @prop() done: boolean;

    constructor(previewItem: Ref<PreviewItem>, fields?: Partial<OrderItem>) {
        super(); this.init(fields);
        this.previewItem = previewItem;
    }
}