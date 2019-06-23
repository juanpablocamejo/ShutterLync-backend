import { BaseObject } from "../base/BaseObject";

export class PaginationOptions extends BaseObject {
    sort: string;
    page: number;
    pageSize: number;

    constructor(fields?: Partial<PaginationOptions>) {
        super({ ...fields, page: +fields.page, pageSize: +fields.pageSize } as Partial<PaginationOptions>);
    }

    get offset() {
        return this.pageSize * this.page;
    }

    get sortField() {
        if (this.sort)
            return this.sort.startsWith("-") ? this.sort.substr(1) : this.sort;
        else return "_id";
    }
    get sortDirection() {
        let dir = -1;
        if (this.sort && !this.sort.startsWith("-")) { dir = 1; }
        return dir;
    }
}
