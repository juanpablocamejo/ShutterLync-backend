import { prop, Ref, arrayProp, instanceMethod } from "typegoose";
import _ from "lodash";
import { PreviewItem } from "./PreviewItem";
import { User } from "./User";
import { Order } from "./Order";
import { OrderItem } from "./OrderItem";
import { BaseObject } from "./base/BaseObject";
import { Client } from "./Client";
import { ProjectStates } from "./enums/ProjectState";
import { OrderStates } from "./enums/OrderState";


export class Project extends BaseObject {
    @prop()
    private _order: Order;

    @arrayProp({ items: PreviewItem })
    private _previewItems: PreviewItem[] = [];

    @prop({ required: true })
    public title: string;

    @prop({ required: true })
    public state: ProjectStates = ProjectStates.CREATED;

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
        super(); this.init(fields);
    }
    @prop()
    get order(): Order { return this._order; }
    set order(value) { this._order = value; }
    @prop()
    get previewItems(): PreviewItem[] {
        return this._previewItems;
    }
    @instanceMethod
    private orderStateActions(): { [orderState: string]: () => void } {
        return {
            [OrderStates.COMPLETED]: this.completeOrder.bind(this),
            [OrderStates.CONFIRMED]: this.confirmOrder.bind(this),
            [OrderStates.DELIVERED]: this.markAsDelivered.bind(this)
        };
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

    @instanceMethod
    public confirmOrder() {
        this._order.confirm();
        this.state = ProjectStates.ORDER_LOADED;
    }

    @instanceMethod
    public completeOrder() {
        this._order.complete();
        this.state = ProjectStates.COMPLETED;
    }
    @instanceMethod
    public markAsDelivered() {
        this._order.markAsDelivered();
        this.state = ProjectStates.DELIVERED;
    }
    @instanceMethod
    public applyOrderAction(state: OrderStates) {
        this.orderStateActions()[state]();
    }
    @instanceMethod
    updateOrder(newOrder: Order) {
        this.order = !this.order ? new Order() : new Order(this.order.orderItems, this.order.state);
        this.order.addItems(newOrder.orderItems, true);
        if (newOrder.state != this.order.state) {
            this.applyOrderAction(newOrder.state);
        }

    }




}

