import { BaseError } from "./BaseError";

export class DuplicatedUserError extends BaseError {
    constructor() {
        super("Ya existe un usuario registrado para ese email");
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = BaseError.name; // stack traces display correctly now
    }
}