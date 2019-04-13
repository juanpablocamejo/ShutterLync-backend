import RepositoryBase from "./repositoryBase";
import { Project } from "../models/project";

class ProjectRepository extends RepositoryBase<Project> {
    constructor() {
        super(new Project().getModelForClass(Project));
    }
}

export default ProjectRepository;