import { ProjectRepository } from "../repositories/ProjectRepository";
import { ObjectId } from "mongodb";
import { Order } from "../models/Order";
import { PreviewItem } from "../models/PreviewItem";
import { Project } from "../models/Project";
import { plainToClass } from "class-transformer";

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
        const project = await this.projectRepository.findById(projectId);
        const { order } = project;
        return project;
    }

    async findByClient(clientEmail: string) {
        return await this.projectRepository.findByClient(clientEmail);
    }

    async saveOrder(projectId: string, order: Order) {
        const proj = await this.findById(projectId);
        proj.order = order;
        proj.order.confirm();
        return await this.projectRepository.update(new ObjectId(projectId), proj);
    }
    // async confirmOrder(projectId: string, order: Order);
}

export default ProjectService;