import { CommandDto } from "./base/CommandDto";
import { IsArray, IsMongoId, IsEnum } from "class-validator";
import { ObjectId } from "mongodb";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { OrderState } from "../models/enums/OrderState";

export class OrderCmdDto extends CommandDto<Order> {
    @IsMongoId() projectId: string;
    @IsEnum(OrderState) state: OrderState;
    @IsArray() orderItems: OrderItemCmdDto[];

    constructor(fields?: Partial<OrderCmdDto>) {
        super(); this.init(fields);
    }

    toEntity(): Order {
        return new Order(this.orderItems.map(itm => new OrderItemCmdDto(itm).toEntity()), this.state);
    }
}
export class OrderItemCmdDto extends CommandDto<OrderItem> {
    previewItemId: string;
    notes: string;
    done: boolean = false;

    constructor(fields?: Partial<OrderItemCmdDto>) {
        super(); this.init(fields);
    }

    toEntity(): OrderItem {
        return new OrderItem(this.previewItemId as any, { notes: this.notes, done: this.done });
    }
}


