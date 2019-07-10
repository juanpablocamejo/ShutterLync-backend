import { CommandDto } from "./base/CommandDto";
import { OrderItem } from "../models/OrderItem";
export class OrderItemCmdDto extends CommandDto<OrderItem> {
    previewItemId: string;
    notes: string;
    done: boolean = false;
    constructor(fields?: Partial<OrderItemCmdDto>) {
        super();
        this.init(fields);
    }
    toEntity(): OrderItem {
        return new OrderItem(this.previewItemId as any, { notes: this.notes, done: this.done });
    }
}
