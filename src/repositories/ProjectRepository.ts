import { RepositoryBase } from "./RepositoryBase";
import { Project } from "../models/project";

export class ProjectRepository extends RepositoryBase<Project> {
    constructor() {
        super(new Project().getModelForClass(Project));
    }

    async findByClient(clientId: string) {
        return this.dbModel.find({ client: clientId });
    }
}