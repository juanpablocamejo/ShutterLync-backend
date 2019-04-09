import ProjectService from "../app/services/projectService";
import { Request, Response } from "express";
class ProjectController {
    private _projectService: ProjectService;

    constructor() {
        this._projectService = new ProjectService();
    }
    findById = (req: Request, res: Response) => {
        this._projectService.findById(req.params._id)
            .then(result => res.json(result))
            .catch(err => res.status(404).json("no se encontró el proyecto"));

    }
}
export default ProjectController;