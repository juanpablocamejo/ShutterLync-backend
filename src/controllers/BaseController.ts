import express, { IRouterMatcher, Router } from "express";
import { ValidationMiddleware } from "../config/middlewares/ValidationMiddleware";
export enum HttpVerb { GET = "GET", POST = "POST", PUT = "PUT", PATCH = "PATCH", DELETE = "DELETE" }

export interface IController {
    config(app: express.Express): void;
    initializeRoutes(): void;
}

export abstract class BaseController implements IController {
    protected router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public config(app: express.Express) {
        app.use("/", this.router);
    }


    abstract initializeRoutes(): void;


    private addRoute<T>(verb: HttpVerb, path: string, handler: express.RequestHandler, inputType?: new () => T) {
        const handlers = inputType ? [new ValidationMiddleware<T>(inputType).handler, handler] : [handler];
        switch (verb) {
            case HttpVerb.GET: { this.router.get(path, ...handlers); break; }
            case HttpVerb.POST: { this.router.post(path, ...handlers); break; }
            case HttpVerb.PUT: { this.router.put(path, ...handlers); break; }
            case HttpVerb.PATCH: { this.router.patch(path, ...handlers); break; }
            case HttpVerb.DELETE: { this.router.delete(path, ...handlers); break; }
        }

    }

    get<T>(path: string, handler: express.RequestHandler, inputType?: new () => T) {
        this.addRoute(HttpVerb.GET, path, handler, inputType);
    }
    post<T>(path: string, handler: express.RequestHandler, inputType?: new () => T) {
        this.addRoute(HttpVerb.POST, path, handler, inputType);
    }
    put<T>(path: string, handler: express.RequestHandler, inputType?: new () => T) {
        this.addRoute(HttpVerb.PUT, path, handler, inputType);
    }
    patch<T>(path: string, handler: express.RequestHandler, inputType?: new () => T) {
        this.addRoute(HttpVerb.PATCH, path, handler, inputType);
    }
    delete<T>(path: string, handler: express.RequestHandler, inputType?: new () => T) {
        this.addRoute(HttpVerb.DELETE, path, handler, inputType);
    }
}