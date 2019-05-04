import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import importToArray from "import-to-array";
import { plainToClassFromExist, plainToClass } from "class-transformer";
import { Cors } from "./CorsMiddleware";
import * as allControllers from "../../controllers";
import _ from "lodash";
import { IController, BaseController } from "../../controllers/BaseController";
import { ClassType } from "class-transformer/ClassTransformer";
import { ErrorMiddleware } from "./ErrorMiddleware";

const controllers = importToArray(allControllers);

export class BaseMiddleware {
    get configuration() {
        const app = express();
        app.use(bodyParser.json());
        app.use(methodOverride());
        app.use(new Cors().middleware);
        _.forEach(controllers, (ControllerClass) => {
            new ControllerClass().config(app);
        });
        app.use(new ErrorMiddleware().middleware);
        return app;
    }
}
