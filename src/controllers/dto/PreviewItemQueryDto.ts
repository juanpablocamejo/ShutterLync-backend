import { QueryDto } from "./base/QueryDto";
import { PreviewItem } from "../../models/PreviewItem";
import { ObjectId } from "bson";

export class PreviewItemQueryDto extends QueryDto<PreviewItem> {
    id: string;
    fileData: string;
    fileName: string;
    fromEntity(entity: PreviewItem): PreviewItemQueryDto {
        this.id = entity._id.toHexString();
        this.fileName = entity.filename;
        this.fileData = (<ObjectId>entity.fileData).toHexString();
        return this;
    }
    constructor(fields?: Partial<PreviewItemQueryDto>) {
        super(fields);
    }
}
