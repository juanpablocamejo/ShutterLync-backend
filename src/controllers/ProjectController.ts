import ProjectService from "../services/ProjectService";
import { Request, Response } from "express";
import { ProjectQueryDto } from "./dto/ProjectQueryDto";
import { ProjectCmdDto } from "./dto/ProjectCmdDto";
import { Project } from "../models/Project";
import { BaseController } from "./BaseController";
import { HttpException } from "../exceptions/HttpException";
import { OrderCmdDto } from "./dto/OrderCmdDto";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";

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

    async findById(req: Request, res: Response, next: Function) {
        try {
            const result = await this.projectService.findById(req.params._id);
            res.json(new ProjectQueryDto().fromEntity(result));
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("no se pudo obtener el proyecto")
                    .build()
            );
        }
    }

    async find(req: Request, res: Response, next: Function) {
        const { clientEmail } = req.query;
        const successHandler = (projects: Project[]) => {
            const dtos = projects.map((p) => new ProjectQueryDto().fromEntity(p));
            res.json(dtos);
        };
        let projects: Project[];
        try {
            if (clientEmail) { projects = await this.projectService.findByClient(clientEmail); }
            else { projects = await this.projectService.getAll(); }
            successHandler(projects);
        } catch (error) {
            next(
                new HttpExceptionBuilder(error)
                    .message("no se pudo obtener los proyectos")
                    .build()
            );
        }

    }
    async create(req: Request, res: Response, next: Function) {
        const project = new ProjectCmdDto(req.body).toEntity();
        try {
            const result = await this.projectService.create(project);
            res.json(result.id);
        }
        catch (error) {
            next(
                new HttpExceptionBuilder(error)
                    .message("no se pudo crear el proyecto")
                    .build()
            );
        }

    }
    async saveOrder(req: Request, res: Response, next: Function) {
        const dto = new OrderCmdDto({ ...req.body, ...req.params });
        try {
            const result = await this.projectService.saveOrder(dto.projectId, dto.toEntity());
            res.status(200).end();
        } catch (error) {
            next(
                new HttpExceptionBuilder(error)
                    .message("no se pudo cargar el pedido")
                    .build()
            );
        }
    }
}