import { QueryDto } from "./base/QueryDto";
import { PreviewItem } from "../models/PreviewItem";
import { ObjectId } from "bson";

export class PreviewItemQueryDto extends QueryDto<PreviewItem> {
    id: string;
    fileData: string;
    fileName: string;

    constructor(fields?: Partial<PreviewItemQueryDto>) {
        super(); this.init(fields);
    }

    fromEntity(entity: PreviewItem): PreviewItemQueryDto {
        this.id = entity._id.toHexString();
        this.fileName = entity.filename;
        this.fileData = (<ObjectId>entity.fileData).toHexString();
        return this;
    }

}
