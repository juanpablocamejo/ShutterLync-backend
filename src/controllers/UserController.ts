import { UserService } from "../services/UserService";
import { AuthResultDto } from "../dto/AuthResultDto";
import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";
import { UserCmdDto } from "../dto/UserCmdDto";
import { UserQueryDto } from "../dto/UserQueryDto";
import { DuplicatedUserError } from "../models/exceptions/DuplicatedUserError";
import { AuthenticationError } from "../models/exceptions/AuthenticationError";
import { AuthResultStatus } from "../models/enums/AuthResultStatus";
import jwt from "jsonwebtoken";
import env from "../config/environment";
import { ConfigKey } from "../config/ConfigKey";
import { User } from "../../src/models/User";


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

    getAuthDto(usr: User) {
        const usrDto = new UserQueryDto().fromEntity(usr);
        const secret = env.get(ConfigKey.JWT_SECRET);
        return new AuthResultDto({
            status: AuthResultStatus.OK,
            token: jwt.sign({ ...usrDto }, secret),
            user: usrDto
        });
    }
    async authenticate(req: Request, res: Response, next: Function) {
        const { email, password } = req.body;
        try {
            const usr = await this.userService.authenticate(email, password);
            if (usr) {

                res.json(this.getAuthDto(usr));
            }
            else {
                throw new AuthenticationError();
            }
        } catch (err) {
            next(new HttpExceptionBuilder(err)
                .message("Error de autenticación")
                .showDetail()
                .when(AuthenticationError, 401)
                .build()
            );
        }
    }
}
