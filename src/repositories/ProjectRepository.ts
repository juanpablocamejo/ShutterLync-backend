import { RepositoryBase } from "./RepositoryBase";
import { Project } from "../models/project";
import { ObjectId } from "bson";
import { PreviewItem } from "../models/previewItem";

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