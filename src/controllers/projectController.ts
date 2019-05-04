import ProjectService from "../services/ProjectService";
import { Request, Response } from "express";
import { ProjectQueryDto } from "./dto/ProjectQueryDto";
import { ProjectCmdDto } from "./dto/ProjectCmdDto";
import { Project } from "../models/Project";
import { BaseController } from "./BaseController";
import { HttpException } from "../exceptions/HttpException";
import { OrderCmdDto } from "./dto/OrderCmdDto";

export class ProjectController extends BaseController {
    private projectService: ProjectService;

    constructor() {
        super();
        this.projectService = new ProjectService();
    }

    initializeRoutes(): void {
        this.get("/projects", this.find.bind(this));
        this.get("/projects/:_id", this.findById.bind(this));
        this.post("/projects", this.create.bind(this), ProjectCmdDto);
        this.post("/projects/:projectId/orders", this.saveOrder.bind(this), OrderCmdDto);
    }

    findById(req: Request, res: Response) {
        this.projectService.findById(req.params._id)
            .then(
                result => { res.json(result); }
            )
            .catch(err => res.status(404).json("no se encontró el proyecto"));
    }

    find(req: Request, res: Response) {
        const { clientId } = req.query;
        const successHandler = (projects: Project[]) => {
            const dtos = projects.map((p) => new ProjectQueryDto().fromEntity(p));
            res.json(dtos);
        };
        if (clientId) {
            this.projectService.findByClient(clientId)
                .then(successHandler, () => res.status(500));
        }
        else {
            this.projectService.getAll()
                .then(successHandler, () => res.status(500));
        }

    }
    async create(req: Request, res: Response, next: Function) {
        const project = new ProjectCmdDto(req.body).toEntity();
        try {
            const result = await this.projectService.create(project);
            res.json(result.id);
        }
        catch {
            next(new HttpException(500, "no se pudo crear el proyecto"));
        }

    }
    async saveOrder(req: Request, res: Response, next: Function) {
        const dto = new OrderCmdDto({ ...req.body, ...req.params });
        try {
            const result = await this.projectService.saveOrder(dto.projectId, dto.toEntity());
            res.status(200).end();
        } catch (error) {
            next(new HttpException(500, "no se pudo cargar la orden"));
        }
    }
}