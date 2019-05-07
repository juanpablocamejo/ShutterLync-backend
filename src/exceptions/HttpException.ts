import { BaseError } from "../models/exceptions/BaseError";

export class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }

    public static fromBaseError(error: BaseError, status: number = 500, message?: string) {
        return new HttpException(status, message || error.message);

    }
}