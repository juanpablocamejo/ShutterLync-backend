import express from "express";
import Middlewares from "./config/middelwares";
import DataAccess from "./config/dataAccess";
import Environment from "./config/environment";

const app = express();

const port = parseInt(process.env.PORT, 10) || 3000;
const env = Environment.loadFile();
const db = DataAccess.mongooseInstance;

app.set("port", port);
app.use(Middlewares.configuration);

app.listen(port, () => {
  console.log(
    "  ShutterLync Server is running at http://localhost:%d in %s mode",
    port,
    app.get("env")
  );
  console.log(" Press CTRL-C to stop\n");
});