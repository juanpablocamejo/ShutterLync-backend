import { RepositoryBase } from "./RepositoryBase";
import { Project } from "../models/Project";
import { PreviewItem } from "../models/PreviewItem";
import { PaginationOptions } from "../models/utils/PaginationOptions";
import { ProjectFilter } from "../services/ProjectFilter";

export class ProjectRepository extends RepositoryBase<Project> {
    constructor() {
        super(new Project().getModelForClass(Project));
    }

    async addPreviewItem(projectId: string, previewItem: PreviewItem) {
        let proj = await this.dbModel.findById(projectId);
        proj.addPreviewItem(previewItem);
        proj = await proj.save();
        return proj.lastPreviewItem();
    }

    async findPaginated(filter: any, projection: any = {}, pagination?: PaginationOptions) {
        const { offset, pageSize, sortDirection, sortField } = pagination;
        const totalCount = await this.dbModel.count(filter).exec();
        const results = await this.dbModel
            .find(filter, projection)
            .sort({ [sortField]: sortDirection })
            .skip(offset)
            .limit(pageSize)
            .exec();
        return { totalCount, results };
    }

    async findByFilter(filter: any, projection: any = {}, pagination?: PaginationOptions) {
        if (pagination) return this.findPaginated(filter, projection, pagination);
        return this.dbModel.find(filter, projection).exec();
    }
}