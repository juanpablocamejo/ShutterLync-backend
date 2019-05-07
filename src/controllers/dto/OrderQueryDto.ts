import { Order } from "../../models/Order";
import { QueryDto } from "./base/QueryDto";
export class OrderQueryDto extends QueryDto<Order> {
    orderItems: string[];
    confirmed: Boolean;
    fromEntity(entity: Order): OrderQueryDto {
        this.orderItems = (entity.selectedItems || []).map(itm => itm._id.toHexString());
        this.confirmed = entity.isConfirmed;
        return this;
    }
}
