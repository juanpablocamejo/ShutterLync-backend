import { Order } from "../models/Order";
import { QueryDto } from "./base/QueryDto";
import { OrderStates } from "../models/enums/OrderState";
import { OrderItem } from "../models/OrderItem";
import { OrderItemQueryDto } from "./OrderItemQueryDto";

export class OrderQueryDto extends QueryDto<Order> {
    orderItems: OrderItemQueryDto[] = [];
    state: OrderStates;

    constructor(fields?: Partial<OrderQueryDto>) {
        super(); this.init(fields);
    }
    fromEntity(entity: Order): OrderQueryDto {
        if (!entity) return this;
        this.orderItems = entity.orderItems.map((itm: OrderItem) => new OrderItemQueryDto().fromEntity(itm));
        this.state = entity.state;
        return this;
    }
}

