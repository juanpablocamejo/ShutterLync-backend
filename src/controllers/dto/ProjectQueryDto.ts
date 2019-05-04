import { Project } from "../../models/Project";
import { QueryDto } from "./base/QueryDto";
import { PreviewItemQueryDto } from "./PreviewItemQueryDto";
import { OrderQueryDto } from "./OrderQueryDto";

export class ProjectQueryDto extends QueryDto<Project> {
    id: string;
    title: string;
    date: Date;
    notes: string;
    quotation: number;
    aditionalItemPrice: number;
    previewItems: PreviewItemQueryDto[];
    clientId: string;
    order: OrderQueryDto;
    constructor(fields?: Partial<ProjectQueryDto>) {
        super(fields);
    }
    fromEntity(entity: Project): ProjectQueryDto {
        this.id = entity._id.toHexString();
        this.title = entity.title;
        this.date = entity.date;
        this.notes = entity.notes;
        this.quotation = entity.quotation;
        this.aditionalItemPrice = entity.aditionalItemPrice;
        this.previewItems = entity.previewItems.map(itm => new PreviewItemQueryDto().fromEntity(itm));
        this.order = new OrderQueryDto().fromEntity(entity.order);
        return this;
    }
}
