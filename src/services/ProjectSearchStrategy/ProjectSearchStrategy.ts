import { UserRole } from "../../models/enums/UserRole";
import { ProjectFilter } from "../ProjectFilter";
import { User } from "../../models/User";
import { StudioProjectSearchStrategy } from "./StudioProjectSearchStrategy";
import { ClientProjectSearchStrategy } from "./ClientProjectSearchStrategy";

export interface IProjectSearchStrategy {
    getQueryFilter(filter: ProjectFilter): any;
}

type IRoleStrategyMap = { [role: string]: new (user: User) => IProjectSearchStrategy };

export abstract class ProjectSearchStrategy implements IProjectSearchStrategy {
    private static RoleStrategyMap: IRoleStrategyMap = {
        [UserRole.CLIENT]: ClientProjectSearchStrategy,
        [UserRole.STUDIO]: StudioProjectSearchStrategy
    };

    abstract getQueryFilter(filter: ProjectFilter): any;

    public static from(user: User): IProjectSearchStrategy {
        return new this.RoleStrategyMap[user.role](user);
    }
}



