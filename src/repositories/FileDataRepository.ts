import { RepositoryBase } from "./RepositoryBase";
import { FileData } from "../models/FileData";

export class FileDataRepository extends RepositoryBase<FileData> {
    constructor() {
        super(new FileData().getModelForClass(FileData));
    }

}