import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import importToArray from "import-to-array";
import { Cors } from "./CorsMiddleware";
import * as allControllers from "../../controllers";
import _ from "lodash";
import { ErrorMiddleware } from "./ErrorMiddleware";
import { Auth } from "./AuthMiddleware";

const controllers = importToArray(allControllers);
export interface IMiddlewareClass {
    middleware: express.RequestHandler;
}

export class MiddlewareConfig {
    get configuration() {
        const app = express();
        app.use(methodOverride());
        app.use(bodyParser.json());
        this.addMiddlewareClass(app, new Cors());
        this.addMiddlewareClass(app, new Auth());
        _.forEach(controllers, (ControllerClass) => {
            new ControllerClass().config(app);
        });
        app.use(new ErrorMiddleware().middleware);
        return app;
    }

    addMiddlewareClass(app: express.Express, instance: IMiddlewareClass) {
        app.use(instance.middleware.bind(instance));
    }
}
