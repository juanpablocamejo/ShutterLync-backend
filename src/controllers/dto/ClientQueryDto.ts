import { QueryDto } from "./base/QueryDto";
import { Client } from "../../models/Client";

export class ClientQueryDto extends QueryDto<Client> {
    name: string;
    lastName: string;
    email: string;
    location: string;

    constructor(fields?: Partial<ClientQueryDto>) {
        super(fields);
    }

    fromEntity(entity: Client): ClientQueryDto {
        this.name = entity.name;
        this.lastName = entity.lastName;
        this.email = entity.email;
        this.location = entity.location;
        return this;
    }
}
