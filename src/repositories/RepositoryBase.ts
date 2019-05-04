
import { Typegoose, InstanceType } from "typegoose";
import { Model, Types } from "mongoose";
class UpdateResult {
    ok: number;
    n: number;
    nModified: number;
}

export class RepositoryBase<T extends Typegoose> {
    protected dbModel: Model<InstanceType<T>>;
    constructor(dbModel: Model<InstanceType<T>>) {
        this.dbModel = dbModel;
    }

    async create(item: T) {
        return await this.dbModel.create(item);
    }

    async retrieve() {
        return await this.dbModel.find({}).exec();
    }

    async update(_id: Types.ObjectId, item: T): Promise<UpdateResult> {
        try {
            return await this.dbModel.update({ _id }, item, { overwrite: true }).exec();

        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async delete(_id: string) {
        return await this.dbModel.deleteOne({ _id: this.toObjectId(_id) }).exec();
    }

    async findById(_id: string) {
        return await this.dbModel.findById(_id).exec();
    }
    async find(criteria: Partial<T>) {
        return await this.dbModel.find(criteria).exec();
    }
    async findOne() {
        return await this.dbModel.findOne().exec();
    }
    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id);
    }
}