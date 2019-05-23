import { User } from "../../models/User";
import { QueryDto } from "./base/QueryDto";
export class UserQueryDto extends QueryDto<User> {
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
}
