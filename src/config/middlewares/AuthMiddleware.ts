import { Request, Response, NextFunction } from "express";
import environment from "../environment";
import { IncomingHttpHeaders } from "http";
import jwt from "jsonwebtoken";
import { ConfigKey } from "../ConfigKey";
import { HttpExceptionBuilder } from "../../exceptions/HttpExceptionBuilder";
import { HttpInvalidAuthHeader } from "../../exceptions/HttpInvalidAuthHeader";
import { UnauthorizedRequest } from "../../exceptions/UnauthorizedRequest";
import { IMiddlewareClass } from "./MiddlewareConfig";

export class Auth implements IMiddlewareClass {
    public middleware(req: Request, res: Response, next: NextFunction) {
        if (environment.openUrls.indexOf(req.path) !== -1) { next(); }
        else {
            const token = this.getTokenFromHeaders(req.headers);
            try {
                if (!token) throw new HttpInvalidAuthHeader();
                else {
                    try {
                        const secret = environment.get(ConfigKey.JWT_SECRET)!;
                        res.locals.currentUser = jwt.verify(token, secret);
                    } catch {
                        throw new UnauthorizedRequest();
                    }
                    next();
                }
            } catch (err) {
                next(
                    new HttpExceptionBuilder(err)
                        .message("No se pudo realizar la operación")
                        .when(HttpInvalidAuthHeader, 401)
                        .when(UnauthorizedRequest, 401, "Acceso no autorizado")
                        .build()
                );
            }
        }
    }
    private getTokenFromHeaders(headers: IncomingHttpHeaders) {
        const { authorization } = headers;
        const validHeader = authorization && authorization.split(" ")[0] === "Bearer";
        return validHeader ? authorization!.split(" ")[1] : undefined;
    }


}