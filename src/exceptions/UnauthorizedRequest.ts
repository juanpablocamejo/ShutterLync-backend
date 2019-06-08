import { HttpException } from "./HttpException";

export class UnauthorizedRequest extends HttpException {
    constructor() {
        super(401, "Acceso no autorizado");
    }
}