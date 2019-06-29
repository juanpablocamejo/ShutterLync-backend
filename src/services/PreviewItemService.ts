import { FileDataRepository } from "../repositories/FileDataRepository";
import { FileData } from "../models/FileData";
import { Binary } from "bson";
import fs from "fs";
import { PreviewItem } from "../models/PreviewItem";
import { ProjectRepository } from "../repositories/ProjectRepository";

export class PreviewItemService {
    private fileDataRepository: FileDataRepository;
    private projectRepository: ProjectRepository;

    constructor() {
        this.fileDataRepository = new FileDataRepository();
        this.projectRepository = new ProjectRepository();
    }

    async getFileData(fileId: string) {
        return await this.fileDataRepository.findById(fileId);
    }

    async create(projectId: string, item: PreviewItem, fileData: FileData) {
        const fData = await this.fileDataRepository.create(fileData);
        item.fileData = fData._id;
        return await this.projectRepository.addPreviewItem(projectId, item);
    }

    async delete(projectId: string, itemId: string) {
        const proj = await this.projectRepository.findById(projectId);
        const item = proj.previewItems.find(itm => itm._id.toHexString() == itemId);
        await this.fileDataRepository.delete((item.fileData as any).toHexString());
        await this.projectRepository.removePreviewItem(projectId, item);
    }
}
