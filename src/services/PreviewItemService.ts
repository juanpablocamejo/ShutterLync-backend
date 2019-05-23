import { FileDataRepository } from "../repositories/FileDataRepository";
import { FileData } from "../models/FileData";
import { Binary } from "bson";
import fs from "fs";
import { PreviewItem } from "../models/previewItem";
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
}
