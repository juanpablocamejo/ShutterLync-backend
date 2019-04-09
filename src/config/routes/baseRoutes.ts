import express = require("express");
import ProjectRoutes from "./projectRoutes";
const app = express();
const router = express.Router();
class BaseRoutes {
    get routes() {
        app.use("/", new ProjectRoutes().routes);
        return app;
    }
}
export = BaseRoutes;