import { CommandDto } from "./base/CommandDto";
import { IsArray, IsMongoId, IsEnum } from "class-validator";
import { ObjectId } from "mongodb";
import { Order } from "../models/Order";
import { OrderItem } from "../models/OrderItem";
import { OrderState } from "../models/enums/OrderState";

export class OrderCmdDto extends CommandDto<Order> {
    @IsMongoId() projectId: string;
    @IsEnum(OrderState) state: OrderState;
    @IsArray() orderItems: string[];

    toEntity(): Order {
        return new Order(this.orderItems.map(id => new OrderItem(new ObjectId(id))), this.state);
    }
}
