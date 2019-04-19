const express = require("express");
import Middlewares from "./config/middelwares";
import DataAccess from "./config/dataAccess";
import Environment from "./config/environment";

export class ShutterlyncServer {
  private app: any;
  private port: number;

  initialize = async () => {
    this.app = express();
    Environment.loadFile();
    this.port = parseInt(process.env.PORT, 10) || 3000;
    this.app.set("port", this.port);
    this.app.use(new Middlewares().configuration);
    return this.app;
  }

  run = async () => {
    await DataAccess.mongooseInstance;
    this.app.listen(this.port, () => {
      console.log(
        "  ShutterLync Server is running at http://localhost:%d in %s mode",
        this.port,
        this.app.get("env")
      );
      console.log(" Press CTRL-C to stop\n");
    });
  }
}

const server = new ShutterlyncServer();
server.initialize();
server.run();