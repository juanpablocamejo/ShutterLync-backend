import { prop } from "typegoose";
import { BaseObject } from "./base/BaseObject";
export class OrderState extends BaseObject {
    @prop({ required: true })
    oid: number;
    @prop({ required: true })
    name: string;
    constructor(fields?: Partial<OrderState>) {
        super();
        this.init(fields);
    }
}
