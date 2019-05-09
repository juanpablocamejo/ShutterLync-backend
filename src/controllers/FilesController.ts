import { Request, Response } from "express";
import { BaseController, IController } from "./BaseController";
import { FileData } from "../models/FileData";
import multer from "multer";
import { PreviewItemService } from "../services/PreviewItemService";
import { PreviewItem } from "../models/previewItem";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";
import Environment from "../config/environment";
import { Binary } from "mongodb";
import fs from "fs";


export class FilesController extends BaseController implements IController {
    private previewItemService: PreviewItemService;

    constructor() {
        super();
        this.previewItemService = new PreviewItemService();
    }

    initializeRoutes(): void {
        this.get("/files/:_id", this.getFileById.bind(this));

        const upload = multer({ dest: "uploads/" });

        this.router.post("/files", upload.single("file"), this.saveFile.bind(this));
    }

    async getFileById(req: Request, res: Response, next: Function) {
        try {
            const result = await this.previewItemService.getFileData(req.params._id);
            res.contentType(result.contentype.toString());
            res.end(result.data.buffer);
        }
        catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("no se pudo obtener el archivo")
                    .build()
            );

        }
    }
    private async createFileDataFrom(dirPath: string, filename: string, mime: string): Promise<FileData> {
        const filePath = dirPath + (dirPath.endsWith("/") ? "" : "/") + filename;
        const fd = new FileData();
        fd.data = new Binary(fs.readFileSync(filePath));
        fd.contentype = mime;
        return fd;
    }
    async saveFile(req: Request, res: Response, next: Function) {
        try {
            const { projectId } = req.body;
            const { uploadsDir } = Environment;
            const { filename, mimetype } = req.file;
            const fileData = await this.createFileDataFrom(uploadsDir, filename, mimetype);
            const newItem = new PreviewItem({ filename: filename });
            const result = await this.previewItemService.create(projectId, newItem, fileData);
            res.json(result);
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("no se pudo guardar el archivo")
                    .build()
            );

        }
    }
}