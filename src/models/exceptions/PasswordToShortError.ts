import { BaseError } from "./BaseError";
export class PasswordTooShortError extends BaseError {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = BaseError.name; // stack traces display correctly now
    }
}
