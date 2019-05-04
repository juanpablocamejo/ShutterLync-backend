import express from "express";
import { BaseMiddleware } from "./config/middlewares/BaseMiddleware";
import DataAccess from "./config/dataAccess";
import Environment from "./config/environment";
import { ShutterlyncLogger } from "./config/logger";

export class ShutterlyncServer {
    private app: any;
    private port: number;
    public logger: ShutterlyncLogger;

    initialize = async () => {
        this.app = express();
        Environment.loadFile();
        this.logger = ShutterlyncLogger.instance;
        this.port = parseInt(process.env.PORT, 10) || 3000;
        this.app.set("port", this.port);
        this.app.use(new BaseMiddleware().configuration);
        return this.app;
    };
    run = async () => {
        await DataAccess.mongooseInstance;
        this.app.listen(this.port, () => {
            console.log("  ShutterLync Server is running at http://localhost:%d in %s mode", this.port, this.app.get("env"));
            console.log(" Press CTRL-C to stop\n");
        });
    };
}
