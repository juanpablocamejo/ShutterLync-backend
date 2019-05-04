import { Order } from "../../models/Order";
import { QueryDto } from "./base/QueryDto";
export class OrderQueryDto extends QueryDto<Order> {
    orderItems: string[];
    fromEntity(entity: Order): OrderQueryDto {
        this.orderItems = entity.selectedItems.map(itm => itm._id.toHexString());
        return this;
    }
}
