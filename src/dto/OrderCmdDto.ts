import { CommandDto } from "./base/CommandDto";
import { IsArray, IsMongoId, IsEnum } from "class-validator";
import { ObjectId } from "mongodb";
import { Order } from "../models/Order";
import { OrderStates } from "../models/enums/OrderState";
import { OrderItemCmdDto } from "./OrderItemCmdDto";

export class OrderCmdDto extends CommandDto<Order> {
    @IsMongoId() projectId: string;
    @IsEnum(OrderStates) state: OrderStates;
    @IsArray() orderItems: OrderItemCmdDto[];

    constructor(fields?: Partial<OrderCmdDto>) {
        super(); this.init(fields);
    }

    toEntity(): Order {
        return new Order(this.orderItems.map(itm => new OrderItemCmdDto(itm).toEntity()), this.state);
    }
}