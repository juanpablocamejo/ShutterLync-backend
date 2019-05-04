import { UserService } from "../services/UserService";
import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { HttpException } from "../exceptions/HttpException";
import { UserCmdDto } from "./dto/UserCmdDto";
import { BaseError } from "../models/exceptions/BaseError";
import { DuplicatedUserError } from "../models/exceptions/DuplicatedUserError";

export class UserController extends BaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    initializeRoutes(): void {
        this.get("/auth", this.authenticate.bind(this));
        this.post("/users", this.createUser.bind(this), UserCmdDto);
    }

    async createUser(req: Request, res: Response, next: Function) {
        const user = new UserCmdDto({ ...req.body }).toEntity();
        try {
            const usr = await this.userService.create(user);
            res.json(usr.id);
        } catch (err) {
            const msg = err instanceof BaseError ? err.message : "no se pudo generar el usuario";
            const code = err instanceof DuplicatedUserError ? 409 : undefined;
            next(new HttpException(code || 500, msg));
        }
    }

    async authenticate(req: Request, res: Response, next: Function) {
        const { email, password } = req.params;
        try {
            res.json(await this.userService.authenticate(email, password));
        } catch {
            next(new HttpException(403, "Usuario o contraseña inválidos"));
        }
    }
}
