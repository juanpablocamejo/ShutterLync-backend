import { ProjectRepository } from "../repositories/ProjectRepository";
import { ObjectId, ObjectID } from "mongodb";
import { Order } from "../models/Order";
import { Project } from "../models/Project";
import { OrderState } from "../models/enums/OrderState";
import { ProjectState } from "../models/enums/ProjectState";
import { InvalidOperationError } from "../models/exceptions/InvalidOperationError";
import { UnauthorizedOperationError } from "../models/exceptions/UnauthorizedOperationError";
import { ProjectFilter } from "./ProjectFilter";
import { User } from "../models/User";
import { ProjectSearchStrategy } from "./ProjectSearchStrategy/ProjectSearchStrategy";
import { PaginationOptions } from "../models/utils/PaginationOptions";

class ProjectService {
    private projectRepository: ProjectRepository;

    constructor() {
        this.projectRepository = new ProjectRepository();
    }

    async create(project: Project) {
        return await this.projectRepository.create(project);
    }

    async find(user: User, filter: ProjectFilter, excludePreviewItems: boolean = true, pagination?: PaginationOptions) {
        const queryFilter = ProjectSearchStrategy.from(user).getQueryFilter(filter);
        return await this.projectRepository.findByFilter(queryFilter, excludePreviewItems ? { previewItems: 0 } : undefined, pagination);
    }

    async findByOwner(ownerId?: string) {
        const filter = ownerId ? { owner: ownerId } : {};
        return await this.projectRepository.find({});
    }

    async findById(projectId: string) {
        const project = await this.projectRepository.findById(projectId);
        return project;
    }

    private async updateProjectOrder(proj: Project, newOrder: Order): Promise<void> {
        proj.order = newOrder;
        if (newOrder.state === OrderState.CONFIRMED) {
            proj.order.confirm();
            proj.state = ProjectState.ORDER_LOADED;
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
        await this.updateProjectOrder(proj, newOrder);
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