
export class BaseError extends Error {
    public message: string;
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = BaseError.name; // stack traces display correctly now
    }

}
