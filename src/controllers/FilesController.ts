import { Request, Response } from "express";
import { BaseController, IController } from "./BaseController";
import { FileData } from "../models/FileData";
import multer from "multer";
import { PreviewItemService } from "../services/PreviewItemService";
import { PreviewItem } from "../models/PreviewItem";
import { HttpExceptionBuilder } from "../exceptions/HttpExceptionBuilder";
import Environment from "../config/environment";
import { Binary } from "mongodb";
import fs from "fs";
import { PreviewItemQueryDto } from "../dto/PreviewItemQueryDto";
import { HttpException } from "../exceptions/HttpException";

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
        this.delete("/previewItems/:itemId", this.deletePreviewItem.bind(this));
    }

    async getFileById(req: Request, res: Response, next: Function) {
        try {
            const result = await this.previewItemService.getFileData(req.params._id);
            if (result === null) throw new HttpException(404, "Archivo no disponible");
            res.contentType(result.contentype.toString());
            res.end(result!.data.buffer);
        }
        catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("No se pudo obtener el archivo")
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
    private async removetempFile(dirPath: string, fileName: string) {
        const filePath = dirPath + (dirPath.endsWith("/") ? "" : "/") + fileName;
        fs.unlinkSync(filePath);
    }

    async saveFile(req: Request, res: Response, next: Function) {
        try {
            const { projectId } = req.body;
            const { uploadsDir } = Environment;
            const { originalname, filename, mimetype } = req.file;
            const fileData = await this.createFileDataFrom(uploadsDir, filename, mimetype);
            const newItem = new PreviewItem({ filename: originalname });
            const result = await this.previewItemService.create(projectId, newItem, fileData);
            this.removetempFile(uploadsDir, filename);
            res.json(new PreviewItemQueryDto().fromEntity(result));
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("No se pudo guardar el archivo")
                    .build()
            );

        }
    }

    async deletePreviewItem(req: Request, res: Response, next: Function) {
        try {
            await this.previewItemService.delete(req.query.projectId, req.params.itemId);
            res.status(200).send();
        } catch (err) {
            next(
                new HttpExceptionBuilder(err)
                    .message("No se pudo eliminar el item de la muestra")
                    .build()
            );

        }
    }
}