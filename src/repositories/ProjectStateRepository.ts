import { RepositoryBase } from "./RepositoryBase";
import { ProjectState } from "../models/ProjectState";

export class ProjectStateRepository extends RepositoryBase<ProjectState> {
    constructor() {
        super(ProjectState);
    }
}