import RepositoryBase from "./repositoryBase";
import { FileData } from "../models/fileData";

class FileDataRepository extends RepositoryBase<FileData> {
    constructor() {
        super(new FileData().getModelForClass(FileData));
    }

}

export default FileDataRepository;