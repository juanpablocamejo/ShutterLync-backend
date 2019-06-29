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
    addItems(orderItems: OrderItem[], clear: boolean = false) {
        if (clear) this.removeItems();
        orderItems.forEach(itm => {
            this.addItem(itm);
        });
    }
    @instanceMethod
    removeItem(orderItem: OrderItem): void {
        this.orderItems = this.orderItems.filter(itm => itm.previewItem != orderItem.previewItem);
    }
    @instanceMethod
    removeItems(): void {
        this.orderItems = [];
    }
    @instanceMethod
    confirm(): void {
        if (this.state != OrderState.PENDING) throw new InvalidOperationError("El pedido debe estar PENDIENTE para ser confirmado");
        this.state = OrderState.CONFIRMED;
    }
    @instanceMethod
    complete() {
        if (this.state != OrderState.CONFIRMED) throw new InvalidOperationError("El pedido debe estar CONFIRMADO para ser completado.");
        this.state = OrderState.COMPLETED;
    }
    @instanceMethod
    markAsDelivered(): void {
        if (this.state != OrderState.COMPLETED) throw new InvalidOperationError("El pedido debe estar COMPLETADO para ser entregado.");
        this.state = OrderState.DELIVERED;
    }
}
