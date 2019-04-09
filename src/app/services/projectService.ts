import ProjectRepository from "../repositories/projectRepository";
class ProjectService {
    private _projectRepository: ProjectRepository;

    constructor() {
        this._projectRepository = new ProjectRepository();
    }

    async findById(_id: string) {
       return await this._projectRepository.findById(_id);
    }
}

export default ProjectService;