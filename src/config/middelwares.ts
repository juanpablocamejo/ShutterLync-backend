import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import BaseRoutes from "./routes/baseRoutes";
import { Cors } from "./cors";

class MiddlewaresBase {
    get configuration() {
        const app = express();
        app.use(bodyParser.json());
        app.use(methodOverride());
        app.use(new Cors().middleware);
        app.use(new BaseRoutes().routes);

        return app;
    }
}

export default MiddlewaresBase;