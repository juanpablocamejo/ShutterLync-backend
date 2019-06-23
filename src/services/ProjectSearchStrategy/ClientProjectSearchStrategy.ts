import { ProjectFilter } from "../ProjectFilter";
import { User } from "../../models/User";
import { IProjectSearchStrategy } from "./ProjectSearchStrategy";

export class ClientProjectSearchStrategy implements IProjectSearchStrategy {
    constructor(private user: User) { }
    getQueryFilter(filter: ProjectFilter) {
        return { ...filter.getMongoFilter(), "client.email": this.user.email };
    }
}
