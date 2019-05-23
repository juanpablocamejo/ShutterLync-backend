import { prop, Ref, arrayProp, instanceMethod } from "typegoose";
import _ from "lodash";
import { PreviewItem } from "./previewItem";
import { User } from "./User";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { BaseObject } from "./base/BaseObject";
import { Client } from "./Client";

export class Project extends BaseObject {
    @prop()
    private _order: Order;

    @arrayProp({ items: PreviewItem })
    private _previewItems: PreviewItem[] = [];

    @prop({ required: true })
    public title: string;

    @prop()
    public date: Date;

    @prop()
    public location: string;

    @prop()
    public notes: string;

    @prop()
    public quantity: number;

    @prop()
    public quotation: number;

    @prop()
    public aditionalItemPrice: number;

    @prop({ ref: User })
    public owner: Ref<User>;

    @prop()
    public client: Client;

    constructor(fields?: Partial<Project>) {
        super(fields);
    }

    @prop()
    get previewItems(): PreviewItem[] {
        return this._previewItems;
    }

    @instanceMethod
    public addPreviewItem(item: PreviewItem) {
        this._previewItems.push(item);
    }

    @instanceMethod
    public removePreviewItem(item: PreviewItem) {
        this._previewItems = this._previewItems.filter((elem: PreviewItem) => !elem.equals(item));
    }

    @instanceMethod
    public addToOrder(orderItem: OrderItem) {
        this._order = this._order || new Order();
        this._order.addItem(orderItem);
    }

    @instanceMethod
    public removeFromOrder(orderItem: OrderItem) {
        this._order && this._order.removeItem(orderItem);
    }

    @instanceMethod
    public lastPreviewItem(): PreviewItem {
        return this._previewItems.length ? this._previewItems[this._previewItems.length - 1] : undefined;
    }

    @prop()
    get order(): Order {
        return this._order;
    }
    set order(value) {
        this._order = value;
    }
}