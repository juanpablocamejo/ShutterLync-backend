import { ProjectState } from "../models/enums/ProjectState";
import { BaseObject } from "../models/base/BaseObject";
import { ObjectId } from "bson";

export class ProjectFilter extends BaseObject {
    ownerId: string | ObjectId;
    client: string;
    states: ProjectState[];
    fromDate: Date;
    toDate: Date;
    title: string;

    constructor(fields?: Partial<ProjectFilter>) {
        super(fields);
    }

    private filtersConfig(): any[] {
        return [
            { val: this.client, key: "client.email", q: new RegExp(this.client, "i") },
            { val: this.fromDate, key: "date", q: { $gte: this.fromDate } },
            { val: this.toDate, key: "date", q: this.fromDate ? { $gte: this.fromDate, $lte: this.toDate } : { $lte: this.toDate } },
            { val: this.title, key: "title", q: new RegExp(this.title, "i") },
            { val: this.ownerId, key: "owner", q: this.ownerId },
            { val: this.states, key: "state", q: { $in: [...(this.states || [])] } }
        ];
    }
    getMongoFilter(): any {
        return this.filtersConfig()
            .filter(f => f.val !== undefined)
            .reduce((rec, { key, q }) => ({ ...rec, [key]: q }), {});
    }
}
