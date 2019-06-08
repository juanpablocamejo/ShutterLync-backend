import { RepositoryBase, TypeMapper } from "./RepositoryBase";
import { Project } from "../models/Project";
import { PreviewItem } from "../models/PreviewItem";

export class ProjectRepository extends RepositoryBase<Project> {
    constructor() {
        super(new Project().getModelForClass(Project));
    }

    async findByClient(clientEmail: string) {
        return this.dbModel.find({ "client.email": clientEmail });
    }

    async addPreviewItem(projectId: string, previewItem: PreviewItem) {
        let proj = await this.dbModel.findById(projectId);
        proj.addPreviewItem(previewItem);
        proj = await proj.save();
        return proj.lastPreviewItem();
    }
}