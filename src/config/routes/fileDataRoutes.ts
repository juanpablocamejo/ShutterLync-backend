import express from "express";
import FileDataController from "../../controllers/fileDataController";

const router = express.Router();
class FileDataRoutes {
    private _fileDataController: FileDataController;

    constructor() {
        this._fileDataController = new FileDataController();
    }
    get routes() {
        const controller = this._fileDataController;
        router.get("/files/:_id", controller.findById);
        return router;
    }
}
export default FileDataRoutes;