import { Order } from "../models/Order";
import { QueryDto } from "./base/QueryDto";
import { OrderState } from "../models/enums/OrderState";
import { OrderItem } from "../models/OrderItem";
import { ObjectId } from "mongodb";
export class OrderQueryDto extends QueryDto<Order> {
    orderItems: string[];
    state: OrderState;
    fromEntity(entity: Order): OrderQueryDto {
        if (!entity) return this;
        this.orderItems = (entity.orderItems || []).map((itm: OrderItem) => (<ObjectId>itm.previewItem).toHexString());
        this.state = entity.state;
        return this;
    }
}
