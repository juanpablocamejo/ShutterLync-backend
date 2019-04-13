import FileDataService from "../app/services/fileDataService";
import { Request, Response } from "express";
import { FileData } from "../app/models/fileData";
class FileDataController {
    private _fileDataService: FileDataService;

    constructor() {
        this._fileDataService = new FileDataService();
    }
    findById = async (req: Request, res: Response) => {
        try {
            const result = await this._fileDataService.findById(req.params._id);
            res.contentType(result.contentype.toString());
            res.end(result.data.buffer);
        }
        catch (err) {
            res.status(500).end();
        }
    };

}
export default FileDataController;