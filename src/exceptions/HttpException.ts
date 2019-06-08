import { BaseError } from "../models/exceptions/BaseError";

export class HttpException extends Error {
    status: number;
    message: string;
    showMsg: boolean = false;

    constructor(status: number, message: string, showMsg: boolean = false) {
        super(message);
        this.status = status;
        this.message = message;
        this.showMsg = showMsg;
    }

    public static fromError(error: Error, status: number = 500, message?: string) {
        return new HttpException(status, message || error.message);
    }
}