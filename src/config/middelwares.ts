import express from "express";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import BaseRoutes = require("./routes/baseRoutes");

class MiddlewaresBase {
    static get configuration () {
         const app = express();
         app.use(bodyParser.json());
         app.use(methodOverride());
         app.use(new BaseRoutes().routes);

         return app;
    }
}

export default MiddlewaresBase;