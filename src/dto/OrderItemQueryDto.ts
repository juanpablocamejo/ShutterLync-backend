import { QueryDto } from "./base/QueryDto";
import { OrderItem } from "../models/OrderItem";
import { OrderQueryDto } from "./OrderQueryDto";

export class OrderItemQueryDto extends QueryDto<OrderItem> {
    previewItemId: string;
    notes: string;
    done: boolean = false;
    constructor(fields?: Partial<OrderQueryDto>) {
        super();
        this.init(fields);
    }
    fromEntity(entity: OrderItem): OrderItemQueryDto {
        this.done = entity.done;
        this.notes = entity.notes;
        this.previewItemId = (entity.previewItem as any);
        return this;
    }
}
