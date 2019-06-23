import { CommandDto } from "./base/CommandDto";
import { Client } from "../models/Client";
export class ClientCmdDto extends CommandDto<Client> {
    name: string;
    lastName: string;
    email: string;
    location: string;
    toEntity(): Client {
        return new Client({ ...this } as any);
    }
}
