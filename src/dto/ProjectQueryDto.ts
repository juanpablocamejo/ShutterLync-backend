import { Project } from "../models/Project";
import { QueryDto } from "./base/QueryDto";
import { PreviewItemQueryDto } from "./PreviewItemQueryDto";
import { OrderQueryDto } from "./OrderQueryDto";
import { ClientQueryDto } from "./ClientQueryDto";
import { ProjectStates } from "../models/enums/ProjectState";

export class ProjectQueryDto extends QueryDto<Project> {
    id: string;
    title: string;
    state: ProjectStates;
    date: Date;
    notes: string;
    location: string;
    quotation: number;
    aditionalItemPrice: number;
    previewItems: PreviewItemQueryDto[];
    client: ClientQueryDto;
    order?: OrderQueryDto;
    quantity: number;

    constructor(fields?: Partial<ProjectQueryDto>) {
        super(); this.init(fields);
    }

    fromEntity(entity: Project): ProjectQueryDto {
        this.id = entity._id.toHexString();
        this.title = entity.title;
        this.state = entity.state;
        this.date = entity.date;
        this.notes = entity.notes;
        this.quotation = entity.quotation;
        this.location = entity.location;
        this.aditionalItemPrice = entity.aditionalItemPrice;
        this.quantity = entity.quantity;
        this.previewItems = entity.previewItems.map(itm => new PreviewItemQueryDto().fromEntity(itm));
        this.client = new ClientQueryDto().fromEntity(entity.client);
        if (entity.order) this.order = new OrderQueryDto().fromEntity(entity.order);
        return this;
    }
}
