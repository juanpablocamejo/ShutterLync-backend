import { ProjectRepository } from "../repositories/ProjectRepository";
import { ObjectId } from "mongodb";
import { Order } from "../models/Order";
import { Project } from "../models/Project";
import { ProjectState } from "../models/enums/ProjectState";
import { UnauthorizedOperationError } from "../models/exceptions/UnauthorizedOperationError";
import { ProjectFilter } from "./ProjectFilter";
import { User } from "../models/User";
import { ProjectSearchStrategy } from "./ProjectSearchStrategy/ProjectSearchStrategy";
import { PaginationOptions } from "../models/utils/PaginationOptions";
import { UserQueryDto } from "../dto/UserQueryDto";

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

    async saveOrder(projectId: string, newOrder: Order) {
        const proj = await this.projectRepository.findById(projectId);
        proj.updateOrder(newOrder);
        return await this.projectRepository.update(new ObjectId(projectId), proj);
    }

    async confirmPreview(projectId: string, user: UserQueryDto) {
        const proj = await this.projectRepository.findById(projectId);
        if ((<any>proj.owner).toHexString() !== user.id) throw new UnauthorizedOperationError("Debe ser el creador del proyecto para confirmar la muestra.");
        proj.state = ProjectState.PREVIEW_LOADED;
        return await this.projectRepository.update(new ObjectId(projectId), proj);
    }
}

export default ProjectService;