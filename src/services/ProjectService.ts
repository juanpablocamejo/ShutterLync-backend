import { ProjectRepository } from "../repositories/ProjectRepository";
import { ObjectId } from "mongodb";
import { Order } from "../models/Order";
import { PreviewItem } from "../models/PreviewItem";
import { Project } from "../models/project";
class ProjectService {
    private projectRepository: ProjectRepository;

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    async create(project: Project) {
        return await this.projectRepository.create(project);
    }

    async getAll() {
        return await this.projectRepository.retrieve();
    }

    async findById(projectId: string) {
        return await this.projectRepository.findById(projectId);
    }

    async findByClient(clientId: string) {
        return await this.projectRepository.findByClient(clientId);
    }

    async saveOrder(projectId: string, order: Order) {
        const proj = await this.findById(projectId);
        proj.order = order;
        return await this.projectRepository.update(new ObjectId(projectId), proj);
    }
    // async confirmOrder(projectId: string, order: Order);
}

export default ProjectService;