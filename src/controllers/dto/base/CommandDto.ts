export abstract class CommandDto<T> {
    constructor(fields?: Partial<T>) {
        Object.assign(this, fields);
    }
    abstract toEntity(): T;
}
