import { Ref, arrayProp, prop } from "typegoose";
import { PreviewItem } from "./PreviewItem";
import { BaseObject } from "./base/BaseObject";
import { InvalidOperationError } from "./exceptions/InvalidOperationError";
import { ObjectId } from "mongodb";
import { OrderItem } from "./OrderItem";
import { OrderState } from "./enums/OrderState";

export class Order extends BaseObject {

    @arrayProp({ items: OrderItem })
    private _selectedItems: OrderItem[] = [];

    @prop({ enum: OrderState })
    private state: OrderState = OrderState.PENDING;

    constructor(items?: OrderItem[]) {
        super();
        this._selectedItems = items || [];
    }

    @prop()
    get isConfirmed(): boolean {
        return this.state == OrderState.CONFIRMED;
    }
    @prop()
    get isCompleted(): boolean {
        return this.state == OrderState.COMPLETED;
    }

    get selectedItems(): OrderItem[] {
        return this._selectedItems;
    }

    addItem(orderItem: OrderItem): void {
        this._selectedItems.push(orderItem);
    }

    removeItem(orderItem: OrderItem): void {
        this._selectedItems = this._selectedItems.filter(itm => itm.previewItem != orderItem.previewItem);
    }

    confirm(): void {
        if (this.state != OrderState.PENDING) throw new InvalidOperationError("El pedido ya fué confirmado anteriormente.");
        this.state = OrderState.CONFIRMED;
    }

    complete() {
        if (this.state != OrderState.PENDING) throw new InvalidOperationError("El pedido aún no fué confirmado por el usuario.");
        this.state = OrderState.COMPLETED;
    }
}