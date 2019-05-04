import { plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import * as express from "express";
import { HttpException } from "../../exceptions/HttpException";
import _ from "lodash";

export class ValidationMiddleware<T> {
    private _type: new () => T;
    constructor(type: new () => T) {
        this._type = type;
    }
    get handler(): express.RequestHandler {
        return (req, res, next) => {
            validate(plainToClass(this._type, { ...req.body, ...req.params, ...req.query }))
                .then((errors: ValidationError[]) => {
                    if (errors.length > 0) {
                        const message = errors.map((error: ValidationError) => _.map(error.constraints)).join(", ");
                        next(new HttpException(400, message));
                    } else {
                        next();
                    }
                });
        };
    }
}