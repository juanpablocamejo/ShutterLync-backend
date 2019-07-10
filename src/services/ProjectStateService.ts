import { User } from "../models/User";
import { ProjectStateRepository } from "../repositories/ProjectStateRepository";

export class ProjectStateService {
    private projectStateRepository: ProjectStateRepository;

    constructor() {
        this.projectStateRepository = new ProjectStateRepository();
    }

    async find() {
        return await this.projectStateRepository.retrieve();
    }
}