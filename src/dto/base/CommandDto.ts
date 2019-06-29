export abstract class CommandDto<T> {
    protected constructor(fields?: Partial<T>) { }
    init<T>(fields?: Partial<T>) {
        Object.assign(this, fields);
    }
    abstract toEntity(): T;
}
