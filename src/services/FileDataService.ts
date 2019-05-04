import { FileDataRepository } from "../repositories/FileDataRepository";
import { FileData } from "../models/FileData";
import { Binary } from "bson";
import fs from "fs";


class FileDataService {
    private fileDataRepository: FileDataRepository;

    constructor() {
        this.fileDataRepository = new FileDataRepository();
    }

    async findById(fileId: string) {
        return await this.fileDataRepository.findById(fileId);
    }

    async getFromTemp(filename: string, mime: string): Promise<FileData> {
        const filePath = "uploads/" + filename;
        const fd = new FileData();
        fd.data = new Binary(fs.readFileSync(filePath));
        fd.contentype = mime;
        return fd;
    }
}

export default FileDataService;