import { ShutterlyncLogger } from "./logger";
import dotenv from "dotenv";
import fs from "fs";
import { ConfigKey } from "./ConfigKey";

const logger = ShutterlyncLogger.instance;
class EnvironmentConfig {

    static get openUrls(): string[] {
        return ["/auth"];
    }
    static get(key: ConfigKey) {
        return process.env[key];
    }
    static get environment() {
        return process.env.NODE_ENV;
    }
    static get uploadsDir() {
        return process.env.UPLOADS_DIR;
    }
    static get mongoDBUri() {
        return (this.environment === "production") ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];
    }

    static get allowedOrigins(): RegExp[] {
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