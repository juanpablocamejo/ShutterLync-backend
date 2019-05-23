import { ShutterlyncLogger } from "./logger";
import dotenv from "dotenv";
import fs from "fs";

const logger = ShutterlyncLogger.instance;
class EnvironmentConfig {
    public static get environment() {
        return process.env.NODE_ENV;
    }
    public static get uploadsDir() {
        return process.env.UPLOADS_DIR;
    }
    public static get mongoDBUri(): string {
        return (this.environment === "production") ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];
    }

    public static get allowedOrigins(): RegExp[] {
        return [
            /^https?:\/\/localhost:/,
            /^https?:\/\/shutterlync.herokuapp.com/
        ];
    }
    public static loadFile() {
        if (fs.existsSync(".env")) {
            logger.debug("cargando variables de entorno desde archivo .env");
            dotenv.config({ path: ".env" });
        }
    }

}

export default EnvironmentConfig;