import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";
import { UserCmdDto } from "./dto/UserCmdDto";
import { UserQueryDto } from "./dto/UserQueryDto";
import { DuplicatedUserError } from "../models/exceptions/DuplicatedUserError";
import { AuthenticationException } from "../models/exceptions/AuthenticationException";


export class UserController extends BaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    initializeRoutes(): void {
        this.post("/auth", this.authenticate.bind(this));
        this.get("/users", this.find.bind(this));
        this.post("/users", this.createUser.bind(this), UserCmdDto);
    }

    async find(req: Request, res: Response, next: Function) {
        const { find } = req.query;
        try {
            const result = await this.userService.findByText(find);
            res.json(result.map(usr => {
                return new UserQueryDto().fromEntity(usr);
            }));
        } catch (error) {
            next(
                new HttpExceptionBuilder(error)
                    .message("no se pudo realizar la búsqueda")
                    .build()
            );
        }
    }

    async createUser(req: Request, res: Response, next: Function) {
        const user = new UserCmdDto({ ...req.body }).toEntity();
        try {
            const usr = await this.userService.create(user);
            res.json(usr.id);
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("no se pudo crear el usuario")
                    .when(DuplicatedUserError, 409)
                    .build()
            );
        }
    }

    async authenticate(req: Request, res: Response, next: Function) {
        const { email, password } = req.body;
        try {
            const usr = await this.userService.authenticate(email, password);
            const dto = new UserQueryDto().fromEntity(usr);
            const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5YWUwYTk1YTM4ZTEzMGZhY2E5ZTQxNiIsImlhdCI6MTUwNDU3OTAwNSwiZXhwIjoxNTA0NTgyNjA1fQ.BJvzPokv7oe0ni9Bt-gT2OWdTAVvk3GRRmeZ5L_ZhvY";
            res.json({ status: "ok", token: jwt, user: dto });
        } catch (err) {
            next(new HttpExceptionBuilder(err)
                .message("Error de autenticación")
                .when(AuthenticationException, 403)
                .build()
            );
        }
    }
}
