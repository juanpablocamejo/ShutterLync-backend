import FileDataService from "../services/FileDataService";
import { Request, Response } from "express";
import { BaseController, IController } from "./BaseController";
import { FileData } from "../models/FileData";

export class FileDataController extends BaseController implements IController {
    private fileDataService: FileDataService;

    constructor() {
        super();
        this.fileDataService = new FileDataService();
    }

    initializeRoutes(): void {
        this.get("/files/:_id", this.findById.bind(this));
    }

    async findById(req: Request, res: Response) {
        try {
            const result = await this.fileDataService.findById(req.params._id);
            res.contentType(result.contentype.toString());
            res.end(result.data.buffer);
        }
        catch (err) {
            res.status(500).end();
        }
    }

}