import { FileDataRepository } from "../repositories/FileDataRepository";

class FileDataService {
    private fileDataRepository: FileDataRepository;

    constructor() {
        this.fileDataRepository = new FileDataRepository();
    }

    async findById(fileId: string) {
        return await this.fileDataRepository.findById(fileId);
    }
}

export default FileDataService;