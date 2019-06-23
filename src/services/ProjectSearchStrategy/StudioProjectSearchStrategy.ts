import { ProjectFilter } from "../ProjectFilter";
import { User } from "../../models/User";
import { IProjectSearchStrategy } from "./ProjectSearchStrategy";

export class StudioProjectSearchStrategy implements IProjectSearchStrategy {
    constructor(private user: User) { }
    getQueryFilter(filter: ProjectFilter) {
        return { ...filter.getMongoFilter(), owner: this.user._id };
    }
}
