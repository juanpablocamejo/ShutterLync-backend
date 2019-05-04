import { CommandDto } from "./base/CommandDto";
import { IsArray, IsMongoId } from "class-validator";
import { ObjectId } from "mongodb";
import { Order } from "../../models/Order";
import { OrderItem } from "../../models/OrderItem";

export class OrderCmdDto extends CommandDto<Order> {
    @IsMongoId() projectId: string;
    @IsArray() orderItems: string[];

    toEntity(): Order {
        return new Order(this.orderItems.map(id => new OrderItem(new ObjectId(id))));
    }
}
