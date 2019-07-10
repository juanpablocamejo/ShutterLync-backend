import { RepositoryBase } from "./RepositoryBase";
import { OrderState } from "../models/OrderState";

export class OrderStateRepository extends RepositoryBase<OrderState> {
    constructor() {
        super(OrderState);
    }
}