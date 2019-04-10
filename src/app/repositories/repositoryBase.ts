
import { Typegoose, InstanceType } from "typegoose";
import { Model, Types } from "mongoose";

class RepositoryBase<T extends Typegoose> {
    private _dbModel: Model<InstanceType<T>>;
    constructor(dbModel: Model<InstanceType<T>>) {
        this._dbModel = dbModel;
    }

    async create(item: T) {
        return await this._dbModel.create(item);
    }

    async retrieve() {
        return await this._dbModel.find({}).exec();
    }

    async update(_id: Types.ObjectId, item: T) {
        return await this._dbModel.updateOne({ _id: _id }, item).exec();
    }

    async delete(_id: string) {
        return await this._dbModel.remove({ _id: this.toObjectId(_id) }).exec();
    }

    async findById(_id: string) {
        return await this._dbModel.findById(_id).exec();
    }


    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id);
    }
}

export = RepositoryBase;