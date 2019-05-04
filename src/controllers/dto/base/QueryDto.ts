
export abstract class QueryDto<T> {

    constructor(fields?: Partial<QueryDto<T>>) {
        Object.assign(this, fields);
    }

    abstract fromEntity(entity: T): QueryDto<T>;
}
