import { ProjectRepository } from "../repositories/ProjectRepository";
import { ObjectId, ObjectID } from "mongodb";
import { Order } from "../models/Order";
import { Project } from "../models/Project";
import { OrderState } from "../models/enums/OrderState";
import { ProjectState } from "../models/enums/ProjectState";
import { InvalidOperationError } from "../models/exceptions/InvalidOperationError";
import { UnauthorizedOperationError } from "../models/exceptions/UnauthorizedOperationError";

class ProjectService {
    private projectRepository: ProjectRepository;

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    async create(project: Project) {
        return await this.projectRepository.create(project);
    }

    async findByOwner(ownerId?: string) {
        const filter = ownerId ? { owner: ownerId } : {};
        return await this.projectRepository.find({});
    }

    async findById(projectId: string) {
        const project = await this.projectRepository.findById(projectId);
        return project;
    }

    async findByClient(clientEmail: string) {
        return await this.projectRepository.findByClient(clientEmail);
    }

    private async addOrderToProject(proj: Project, newOrder: Order): Promise<void> {
        proj.order = proj.order || new Order([], OrderState.PENDING);
        proj.order.addItems(newOrder.orderItems);
        if (newOrder.state === OrderState.CONFIRMED) {
            proj.order.confirm();
            proj.state = ProjectState.PENDING;
        }
        if (newOrder.state === OrderState.COMPLETED) {
            proj.order.complete();
            proj.state = ProjectState.COMPLETED;
        }
    }

    async saveOrder(projectId: string, newOrder: Order) {
        const proj = await this.projectRepository.findById(projectId);
        if (newOrder.state != OrderState.COMPLETED && proj.state != ProjectState.PREVIEW_LOADED) {
            throw new InvalidOperationError("No se puede cargar un pedido hasta que el fotografo confirme la muestra.");
        }
        await this.addOrderToProject(proj, newOrder);
        return await this.projectRepository.update(new ObjectId(projectId), proj);
    }

    async confirmPreview(projectId: string, userId: string) {
        const proj = await this.projectRepository.findById(projectId);
        if ((<any>proj.owner).toHexString() !== userId) throw new UnauthorizedOperationError("Debe ser el creador del proyecto para confirmar la muestra.");
        proj.state = ProjectState.PREVIEW_LOADED;
        return await this.projectRepository.update(new ObjectId(projectId), proj);
    }
}

export default ProjectService;