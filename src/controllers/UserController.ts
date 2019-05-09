import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { HttpException } from "../exceptions/HttpException";
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
        this.get("/auth", this.authenticate.bind(this));
        this.get("/users", this.find.bind(this));
        this.post("/users", this.createUser.bind(this), UserCmdDto);
    }

    async find(req: Request, res: Response, next: Function) {
        const { find } = req.query;
        try {
            const result = await this.userService.findByText(find);
            res.json(result.map(usr => new UserQueryDto().fromEntity(usr)));
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
        const { email, password } = req.params;
        try {
            res.json(await this.userService.authenticate(email, password));
        } catch (err) {
            next(new HttpExceptionBuilder(err)
                .message("no se pudo authenticar el usuario")
                .when(AuthenticationException, 403)
                .build()
            );
        }
    }
}
