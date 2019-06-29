import { User } from "../models/User";
import { CommandDto } from "./base/CommandDto";
import { UserRole } from "../models/enums/UserRole";
import { IsString, Length, IsEmail, IsOptional, MaxLength, IsEnum } from "class-validator";


export class UserCmdDto extends CommandDto<User> {

    constructor(fields?: Partial<UserCmdDto>) {
        super(); this.init(fields);
    }
    @IsString() @Length(2, 200) name: string;
    @IsString() @Length(2, 200) lastName: string;
    @IsEmail() email: string;
    @IsString() @MaxLength(500) @IsOptional() location: string;
    @IsString() @Length(8, 50) @IsOptional() password: string;
    @IsEnum(UserRole) role: string;

    toEntity(): User {
        return new User({
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            location: this.location,
            password: this.password,
            role: (<any>UserRole)[this.role]
        });
    }
}
