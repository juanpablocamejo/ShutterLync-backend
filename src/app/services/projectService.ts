import ProjectRepository from "../repositories/projectRepository";
import { ObjectId } from "mongodb";
import { Order } from "../models/order";
class ProjectService {
    private _projectRepository: ProjectRepository;

    constructor() {
        this._projectRepository = new ProjectRepository();
    }

    async findById(_id: string) {
        return await this._projectRepository.findOne();
    }

    async saveOrder(_id: string, order: Order) {
        return await this._projectRepository.partialUpdate(new ObjectId(_id),
            { order: order }
        );
    }
}

export default ProjectService;