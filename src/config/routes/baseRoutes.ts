import express = require("express");
import ProjectRoutes from "./projectRoutes";
import FileDataRoutes from "./fileDataRoutes";
const app = express();
const router = express.Router();
class BaseRoutes {
    get routes() {
        app.use("/", new ProjectRoutes().routes);
        app.use("/", new FileDataRoutes().routes);
        return app;
    }
}
export = BaseRoutes;