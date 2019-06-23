import { BaseError } from "../models/exceptions/BaseError";
import { HttpException } from "./HttpException";
export class HttpExceptionBuilder {
    private _baseError: any;
    private _status: number;
    private _detail: string;
    private _showDetail: boolean;
    private _message: string;

    constructor(err: any) {
        this._baseError = err;
        this._status = 500;
        this._message = "No se pudo completar la operación";
        if (this.isBaseError || this.isHttpException) this._detail = err.message;
        if (this.isHttpException) { this._status = err.status; this._showDetail = err.showMsg; }
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

    public showDetail() {
        this._showDetail = true;
        return this;
    }

    public when(errType: new () => Error, status?: number, detail?: string, showDetail?: boolean): HttpExceptionBuilder {
        if (this._baseError instanceof errType) {
            if (status) this._status = status;
            if (detail) this._detail = detail;
            if (showDetail) this._showDetail = showDetail;
        }
        return this;
    }

    public build() {
        console.log(this._baseError);
        return new HttpException(this._status, this.getMessage(), this._showDetail);
    }
    private getMessage() { return this._message + (this._detail ? `: ${this._detail}` : ""); }
}