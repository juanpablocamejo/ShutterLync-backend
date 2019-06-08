import { HttpException } from "./HttpException";

export class HttpInvalidAuthHeader extends HttpException {
    constructor() {
        super(400, "La información de autenticación tiene un formato incorrecto.");
    }

}