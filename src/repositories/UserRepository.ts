import { RepositoryBase } from "./RepositoryBase";
import { User } from "../models/User";
import { MongoError } from "mongodb";
import { DuplicatedUserError } from "../models/exceptions/DuplicatedUserError";

export class UserRepository extends RepositoryBase<User> {
    constructor() {
        const obj = new User().getModelForClass(User);
        super(obj);
    }

    async create(user: User) {
        try {
            return await super.create(user);
        } catch (error) {
            if (error.name == MongoError.name && error.code === 11000) {
                throw new DuplicatedUserError();
            }
            else throw error;
        }
    }

}
