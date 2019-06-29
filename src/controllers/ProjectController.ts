import ProjectService from "../services/ProjectService";
import { Request, Response } from "express";
import { ProjectQueryDto } from "../dto/ProjectQueryDto";
import { ProjectCmdDto } from "../dto/ProjectCmdDto";
import { Project } from "../models/Project";
import { BaseController } from "./BaseController";
import { OrderCmdDto } from "../dto/OrderCmdDto";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";
import { UserQueryDto } from "../dto/UserQueryDto";
import { ProjectFilter } from "../services/ProjectFilter";
import { PaginationOptions } from "../models/utils/PaginationOptions";
export interface PaginatedResult<T> {
    totalCount: number;
    results: T[];
}
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
        this.put("/projects/:projectId/orders", this.saveOrder.bind(this), OrderCmdDto);
    }

    async findById(req: Request, res: Response, next: Function) {
        try {
            const result = await this.projectService.findById(req.params.projectId);
            res.json(new ProjectQueryDto().fromEntity(result));
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("No se pudo obtener el proyecto")
                    .showDetail()
                    .build()
            );
        }
    }
    async update(req: Request, res: Response, next: Function) {
        const user: UserQueryDto = res.locals.currentUser;
        try {
            await this.projectService.confirmPreview(req.params.projectId, user);
            res.status(200).end();
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("No se pudieron guardar los cambios")
                    .showDetail()
                    .build()
            );
        }
    }

    prepareResult(res: any) {
        const toProjectQueryDto = (p: Project) => new ProjectQueryDto().fromEntity(p);
        if (res.totalCount) { return { totalCount: res.totalCount, results: res.results.map(toProjectQueryDto) }; }
        else { return res.map(toProjectQueryDto); }
    }

    async find(req: Request, res: Response, next: Function) {
        const user = new UserQueryDto(res.locals.currentUser).toEntity();
        try {
            const { excludeItems, states } = req.query;
            const filter = new ProjectFilter({ ...req.query, states: states && states.split(",") });
            const pagination = req.query.page ? new PaginationOptions(req.query) : undefined;
            const result = this.prepareResult(await this.projectService.find(user, filter, excludeItems, pagination));
            res.json(result);
        } catch (error) {
            next(
                new HttpExceptionBuilder(error)
                    .message("No se pudo obtener los proyectos")
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
                    .message("No se pudo crear el proyecto")
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
                    .message("No se pudo cargar el pedido")
                    .build()
            );
        }
    }
}