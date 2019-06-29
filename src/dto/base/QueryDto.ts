
export abstract class QueryDto<T> {

    protected constructor(fields?: Partial<QueryDto<T>>) {

    }

    init<T>(fields?: Partial<T>) {
        Object.assign(this, fields);
    }
    abstract fromEntity(entity: T): QueryDto<T>;
}
