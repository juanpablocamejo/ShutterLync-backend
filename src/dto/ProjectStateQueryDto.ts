import { QueryDto } from "./base/QueryDto";
import { ProjectState } from "../models/ProjectState";
import { UserRole } from "../models/enums/UserRole";

export class ProjectStateQueryDto extends QueryDto<ProjectState> {
    id: number;
    label: string;
    constructor(fields?: Partial<ProjectStateQueryDto>) {
        super();
        this.init(fields);
    }
    fromEntity(entity: ProjectState, role: UserRole = UserRole.CLIENT): ProjectStateQueryDto {
        this.id = entity.oid;
        this.label = role === UserRole.CLIENT ? entity.clientLabel : entity.studioLabel;
        return this;
    }
}
