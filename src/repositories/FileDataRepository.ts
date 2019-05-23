import { RepositoryBase } from "./RepositoryBase";
import { FileData } from "../models/FileData";
import { PreviewItem } from "../models/previewItem";

export class FileDataRepository extends RepositoryBase<FileData> {
    constructor() {
        super(new FileData().getModelForClass(FileData));
    }


}