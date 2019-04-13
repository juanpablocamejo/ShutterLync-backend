import FileDataRepository from "../repositories/fileDataRepository";

class FileDataService {
    private _fileDataRepository: FileDataRepository;

    constructor() {
        this._fileDataRepository = new FileDataRepository();
    }

    async findById(_id: string) {
        return await this._fileDataRepository.findById(_id);
    }
}

export default FileDataService;