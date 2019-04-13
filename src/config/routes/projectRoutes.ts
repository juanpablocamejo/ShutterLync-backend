import express from "express";
import ProjectController from "../../controllers/projectController";

const router = express.Router();
class ProjectRoutes {
    private _projectController: ProjectController;

    constructor() {
        this._projectController = new ProjectController();
    }
    get routes() {
        const controller = this._projectController;
        router.get("/projects/:_id", controller.findById);
        router.post("/projects/:_id/orders", controller.saveOrder);

        return router;
    }


}
export default ProjectRoutes;