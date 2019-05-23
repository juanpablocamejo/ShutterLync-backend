import { NextFunction, Request, Response } from "express";
import { HttpException } from "../../exceptions/HttpException";

export class ErrorMiddleware {
    middleware = (error: HttpException, request: Request, response: Response, next: NextFunction) => {
        const status = error.status || 500;
        const message = error.message || "Error inesperado";
        response
            .status(status)
            .json({
                status,
                message,
            });
    }
}