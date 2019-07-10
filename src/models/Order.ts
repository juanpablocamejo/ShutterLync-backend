import { arrayProp, prop, instanceMethod } from "typegoose";
import { BaseObject } from "./base/BaseObject";
import { InvalidOperationError } from "./exceptions/InvalidOperationError";
import { OrderItem } from "./OrderItem";
import { OrderStates } from "./enums/OrderState";

export class Order extends BaseObject {

    @arrayProp({ items: OrderItem })
    orderItems: OrderItem[] = [];

    @prop({ enum: OrderStates })
    state: OrderStates = OrderStates.PENDING;

    constructor(items?: OrderItem[], state?: OrderStates) {
        super();
        this.orderItems = items || [];
        this.state = state || OrderStates.PENDING;
    }

    @prop()
    get isConfirmed(): boolean {
        return this.state == OrderStates.CONFIRMED;
    }

    @prop()
    get isCompleted(): boolean {
        return this.state == OrderStates.COMPLETED;
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
        if (this.state != OrderStates.PENDING) throw new InvalidOperationError("El pedido debe estar PENDIENTE para ser confirmado");
        this.state = OrderStates.CONFIRMED;
    }
    @instanceMethod
    complete() {
        if (this.state != OrderStates.CONFIRMED) throw new InvalidOperationError("El pedido debe estar CONFIRMADO para ser completado.");
        this.state = OrderStates.COMPLETED;
    }
    @instanceMethod
    markAsDelivered(): void {
        if (this.state != OrderStates.COMPLETED) throw new InvalidOperationError("El pedido debe estar COMPLETADO para ser entregado.");
        this.state = OrderStates.DELIVERED;
    }
}
