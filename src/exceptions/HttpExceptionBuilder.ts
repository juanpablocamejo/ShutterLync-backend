import { BaseError } from "../models/exceptions/BaseError";
import { HttpException } from "./HttpException";
export class HttpExceptionBuilder {
    private _baseError: any;
    private _status: number;
    private _info: string;
    private _showMsg: boolean;
    private _message: string;

    constructor(err: any) {
        this._baseError = err;
        this._status = 500;
        this._message = "No se pudo completar la operación";
        if (this.isBaseError || this.isHttpException) this._info = err.message;
        if (this.isHttpException) { this._status = err.status; this._showMsg = err.showMsg; }
    }

    public get isHttpException() {
        return this._baseError instanceof HttpException;
    }
    public get isError() {
        return this._baseError instanceof Error;
    }

    public get isBaseError() {
        return this._baseError instanceof BaseError;
    }

    public message(message: string) {
        this._message = message;
        return this;
    }

    public showMessage() {
        this._showMsg = true;
        return this;
    }

    public when(errType: new () => Error, status?: number, info?: string, showMsg?: boolean): HttpExceptionBuilder {
        if (this._baseError instanceof errType) {
            if (status) this._status = status;
            if (info) this._info = info;
            if (showMsg) this._showMsg = showMsg;
        }
        return this;
    }

    public build() {
        console.log(this._baseError);
        return new HttpException(this._status, this.getMessage(), this._showMsg);
    }
    private getMessage() { return this._message + (this._info ? `: ${this._info}` : ""); }
}