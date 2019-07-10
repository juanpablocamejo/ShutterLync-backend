import { prop } from "typegoose";
import { BaseObject } from "./base/BaseObject";
export class ProjectState extends BaseObject {
    @prop({ required: true })
    oid: number;
    @prop({ required: true })
    name: string;
    @prop({ required: true })
    studioLabel: string;
    @prop({ required: true })
    clientLabel: string;
    constructor(fields?: Partial<ProjectState>) {
        super();
        this.init(fields);
    }
}
