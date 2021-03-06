import { Request, Response, NextFunction } from "express";
import environment from "../environment";
import { IMiddlewareClass } from "./MiddlewareConfig";


export class Cors implements IMiddlewareClass {

    middleware(req: Request, res: Response, next: NextFunction) {
        const origin = req.header("origin");
        const allowed = environment.allowedOrigins.reduce((allow, regExp) => allow || regExp.test(origin), false);
        if (!allowed) { next(); return; }

        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");

        // intercept OPTIONS method
        if ("OPTIONS" == req.method) {
            res.sendStatus(200);
        }
        else {
            next();
        }
    }


}