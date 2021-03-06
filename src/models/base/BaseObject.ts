import { Types } from "mongoose";
import { IEquatable } from "../interfaces/IEquatable";
import _ from "lodash";
import { Typegoose, instanceMethod, prop } from "typegoose";

export abstract class BaseObject extends Typegoose implements IEquatable {
    _id?: Types.ObjectId;

    @prop({ required: true, default: Date.now })
    createdAt: Date;

    protected constructor(fields?: Partial<BaseObject>) {
        super();
    }

    protected init<T>(fields?: Partial<T>): void {
        Object.assign(this, fields);
    }

    @instanceMethod
    eql(obj: BaseObject): boolean {
        return this._id.equals(obj._id);
    }

    @instanceMethod
    equals(obj: BaseObject): boolean {
        return _.isEqual(this, obj);
    }
}
