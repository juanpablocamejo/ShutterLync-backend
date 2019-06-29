import { UserQueryDto } from "./UserQueryDto";
import { BaseObject } from "../models/base/BaseObject";
import { AuthResultStatus } from "../models/enums/AuthResultStatus";

export class AuthResultDto extends BaseObject {
    status: AuthResultStatus;
    token: string;
    user: UserQueryDto;

    constructor(fields?: Partial<AuthResultDto>) {
        super(); this.init(fields);
    }
}
