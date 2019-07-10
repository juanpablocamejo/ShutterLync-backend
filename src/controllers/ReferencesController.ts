import { Request, Response } from "express";
import { ProjectQueryDto } from "../dto/ProjectQueryDto";
import { ProjectCmdDto } from "../dto/ProjectCmdDto";
import { BaseController } from "./BaseController";
import { OrderCmdDto } from "../dto/OrderCmdDto";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";
import { UserQueryDto } from "../dto/UserQueryDto";
import { ProjectFilter } from "../services/ProjectFilter";
import { PaginationOptions } from "../models/utils/PaginationOptions";
import { ProjectStateService } from "../services/ProjectStateService";
import { ProjectStateQueryDto } from "../dto/ProjectStateQueryDto";

export class ReferencesController extends BaseController {
    private projectStateService: ProjectStateService;

    constructor() {
        super();
        this.projectStateService = new ProjectStateService();
    }

    initializeRoutes(): void {
        this.get("/projectStates", this.getProjectStates.bind(this));
    }

    async getProjectStates(req: Request, res: Response, next: Function) {
        try {
            const user = new UserQueryDto(res.locals.currentUser).toEntity();
            const results = await this.projectStateService.find();

            res.json(results.map((st) => new ProjectStateQueryDto().fromEntity(st, user.role)));
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("No se pudieron obtener los estados")
                    .showDetail()
                    .build()
            );
        }
    }

}