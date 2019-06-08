import { BaseError } from "./BaseError";
export class AuthenticationError extends BaseError {
    constructor() {
        super("Usuario o contraseña incorrectos");
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
        this.name = BaseError.name; // stack traces display correctly now
    }
}
