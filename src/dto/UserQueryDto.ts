import { User } from "../models/User";
import { QueryDto } from "./base/QueryDto";
import { ObjectId } from "bson";
import { UserRole } from "../models/enums/UserRole";
export class UserQueryDto extends QueryDto<User> {
    constructor(fields?: Partial<UserQueryDto>) {
        super(); this.init(fields);
    }
    id: string;
    name: string;
    lastName: string;
    email: string;
    location: string;
    role: string;
    fromEntity(entity: User): UserQueryDto {
        this.id = entity._id.toHexString();
        this.name = entity.name;
        this.lastName = entity.lastName;
        this.email = entity.email;
        this.location = entity.location;
        this.role = entity.role;
        return this;
    }
    toEntity(): User {
        return new User({
            _id: new ObjectId(this.id),
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            location: this.location,
            role: this.role as UserRole
        });
    }
}
