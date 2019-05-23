import { BaseError } from "../models/exceptions/BaseError";
import { HttpException } from "./HttpException";
export class HttpExceptionBuilder {
    private _httpException?: HttpException;
    private _baseError: BaseError;
    private _defaultMsg: string;

    constructor(err: any) {
        this._baseError = err;
        this._defaultMsg = "No se pudo completar la operación";
    }

    public message(message: string) {
        this._defaultMsg = message;
        return this;
    }
    public when(errType: new () => BaseError, status: number = 500, message?: string): HttpExceptionBuilder {
        if (this._baseError instanceof errType) {
            const msg = message || this._baseError.message;
            this._httpException = HttpException.fromBaseError(
                this._baseError,
                status,
                this._defaultMsg + (msg ? `: ${msg}` : "")
            );
        }
        return this;
    }
    public build() {
        if (this._httpException)
            return this._httpException;
        else {
            return this._baseError instanceof BaseError
                ? HttpException.fromBaseError(this._baseError, 500, this.defaultMessage()) :
                new HttpException(500, this._defaultMsg);
        }
    }
    private defaultMessage() { return this._defaultMsg + (this._baseError.message ? `: ${this._baseError.message}` : ""); }
}
