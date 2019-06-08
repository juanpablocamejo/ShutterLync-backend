import { Ref, arrayProp, prop, instanceMethod } from "typegoose";
import { PreviewItem } from "./PreviewItem";
import { BaseObject } from "./base/BaseObject";
import { InvalidOperationError } from "./exceptions/InvalidOperationError";
import { OrderItem } from "./OrderItem";
import { OrderState } from "./enums/OrderState";

export class Order extends BaseObject {

    @arrayProp({ items: OrderItem })
    orderItems: OrderItem[] = [];

    @prop({ enum: OrderState })
    state: OrderState = OrderState.PENDING;

    constructor(items?: OrderItem[], state?: OrderState) {
        super();
        this.orderItems = items || [];
        this.state = state || OrderState.PENDING;
    }

    @prop()
    get isConfirmed(): boolean {
        return this.state == OrderState.CONFIRMED;
    }

    @prop()
    get isCompleted(): boolean {
        return this.state == OrderState.COMPLETED;
    }

    @instanceMethod
    addItem(orderItem: OrderItem): void {
        this.orderItems.push(orderItem);
    }
    @instanceMethod
    addItems(orderItems: OrderItem[]) {
        orderItems.forEach(itm => {
            this.addItem(itm);
        });
    }
    @instanceMethod
    removeItem(orderItem: OrderItem): void {
        this.orderItems = this.orderItems.filter(itm => itm.previewItem != orderItem.previewItem);
    }
    @instanceMethod
    confirm(): void {
        if (this.state != OrderState.PENDING) throw new InvalidOperationError("El pedido ya fué confirmado anteriormente.");
        this.state = OrderState.CONFIRMED;
    }
    @instanceMethod
    complete() {
        switch (this.state) {
            case OrderState.PENDING:
                throw new InvalidOperationError("El pedido aún no fué confirmado por el usuario.");
                break;
            case OrderState.COMPLETED:
                throw new InvalidOperationError("El pedido ya fué completado anteriormente.");
                break;
            default:
                this.state = OrderState.COMPLETED;
                break;
        }
    }
}