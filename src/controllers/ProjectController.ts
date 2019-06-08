import ProjectService from "../services/ProjectService";
import { Request, Response } from "express";
import { ProjectQueryDto } from "../dto/ProjectQueryDto";
import { ProjectCmdDto } from "../dto/ProjectCmdDto";
import { Project } from "../models/Project";
import { BaseController } from "./BaseController";
import { OrderCmdDto } from "../dto/OrderCmdDto";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";
import { UserQueryDto } from "../dto/UserQueryDto";
import { UserRole } from "../models/enums/UserRole";

export class ProjectController extends BaseController {
    private projectService: ProjectService;

    constructor() {
        super();
        this.projectService = new ProjectService();
    }

    initializeRoutes(): void {
        this.get("/projects", this.find.bind(this));
        this.get("/projects/:projectId", this.findById.bind(this));
        this.post("/projects", this.create.bind(this), ProjectCmdDto);
        this.patch("/projects/:projectId", this.update.bind(this));
        this.post("/projects/:projectId/orders", this.saveOrder.bind(this), OrderCmdDto);
    }

    async findById(req: Request, res: Response, next: Function) {
        try {
            const result = await this.projectService.findById(req.params.projectId);
            res.json(new ProjectQueryDto().fromEntity(result));
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("no se pudo obtener el proyecto")
                    .showMessage()
                    .build()
            );
        }
    }
    async update(req: Request, res: Response, next: Function) {
        const user: UserQueryDto = res.locals.currentUser;
        try {
            await this.projectService.confirmPreview(req.params.projectId, user.id);
            res.status(200).end();
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("no se pudieron guardar los cambios")
                    .showMessage()
                    .build()
            );
        }
    }
    async find(req: Request, res: Response, next: Function) {
        const user: UserQueryDto = res.locals.currentUser;
        const successHandler = (projects: Project[]) => {
            const dtos = projects.map((p) => new ProjectQueryDto().fromEntity(p));
            res.json(dtos);
        };
        let projects: Project[];
        try {
            if (user.role === UserRole.CLIENT) { projects = await this.projectService.findByClient(user.email); }
            else { projects = await this.projectService.findByOwner(user.id); }
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
        const user: UserQueryDto = res.locals.currentUser;
        const project = new ProjectCmdDto(req.body).toEntity();
        project.owner = <any>user.id;
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