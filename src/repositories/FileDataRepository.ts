import { RepositoryBase } from "./RepositoryBase";
import { FileData } from "../models/FileData";
import { PreviewItem } from "../models/PreviewItem";

export class FileDataRepository extends RepositoryBase<FileData> {
    constructor() {
        super(FileData);
    }


}