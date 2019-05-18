import { CommandDto } from "./base/CommandDto";
import { IsArray, IsMongoId, IsBoolean } from "class-validator";
import { ObjectId } from "mongodb";
import { Order } from "../../models/Order";
import { OrderItem } from "../../models/OrderItem";

export class OrderCmdDto extends CommandDto<Order> {
    @IsMongoId() projectId: string;
    @IsBoolean() confirmed: boolean;
    @IsArray() selectedItems: string[];

    toEntity(): Order {
        return new Order(this.selectedItems.map(id => new OrderItem(new ObjectId(id))));
    }
}
