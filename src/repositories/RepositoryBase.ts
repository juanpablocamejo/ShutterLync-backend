
import { Typegoose, InstanceType } from "typegoose";
import { Model, Types } from "mongoose";
import { ObjectId } from "mongodb";

class UpdateResult {
    ok: number;
    n: number;
    nModified: number;
}

export type TypeMapper<T> = (arg: InstanceType<T>) => InstanceType<T>;

export class RepositoryBase<T extends Typegoose> {
    protected dbModel: Model<InstanceType<T>>;
    transform: TypeMapper<T> = t => t;
    constructor(dbModel: Model<InstanceType<T>>) {
        this.dbModel = dbModel;
    }

    async create(item: T) {
        return this.transform(await this.dbModel.create(item));
    }

    async retrieve() {
        return (await this.dbModel.find({}).exec()).map(this.transform);
    }

    async update(_id: Types.ObjectId, item: T): Promise<UpdateResult> {
        try {
            return await this.dbModel.update({ _id }, item).exec();

        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async delete(_id: string) {
        return await this.dbModel.deleteOne({ _id: this.toObjectId(_id) }).exec();
    }

    async findById(_id: string) {
        return this.transform(await this.dbModel.findById(new ObjectId(_id)).exec());
    }
    async find(criteria: Partial<T>) {
        return (await this.dbModel.find(criteria).exec()).map(this.transform);
    }
    async findLike(likeOptions: { [P in keyof T]?: string }, limit?: number, options?: Partial<T>) {
        const filter = Object.keys(likeOptions).map((k: string) => ({ [k]: new RegExp((<any>likeOptions)[k], "i") }));
        const query = this.dbModel.find({ $or: filter, ...options });
        if (limit) query.limit(limit || 8);
        return (await query.exec()).map(this.transform);
    }
    async findOne(conditions?: any) {
        return this.transform(await this.dbModel.findOne(conditions).exec());
    }
    private toObjectId(_id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(_id);
    }
}