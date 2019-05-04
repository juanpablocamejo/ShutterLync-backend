import FileDataService from "../services/FileDataService";
import { Request, Response } from "express";
import { BaseController, IController } from "./BaseController";
import { FileData } from "../models/FileData";
import multer from "multer";
import ProjectService from "../services/ProjectService";
import { PreviewItem } from "../models/previewItem";


export class FileDataController extends BaseController implements IController {
    private fileDataService: FileDataService;
    private projectService: ProjectService;

    constructor() {
        super();
        this.fileDataService = new FileDataService();
    }

    initializeRoutes(): void {
        this.get("/files/:_id", this.findById.bind(this));

        const upload = multer({ dest: "uploads/" });

        this.router.post("/files", upload.single("file"), this.saveFile.bind(this));
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
    async saveFile(req: Request, res: Response) {
        try {
            const { projectId } = req.body;
            const fdata = await this.fileDataService.getFromTemp(req.file.filename, req.file.mimetype);
            const proj = await this.projectService.findById(projectId);

        } catch {

        }
    }
}