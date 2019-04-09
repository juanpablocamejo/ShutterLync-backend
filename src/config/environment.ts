import logger from "./logger";
import dotenv from "dotenv";
import fs from "fs";

class EnvironmentConfig {
    public static get environment() {
        return process.env.NODE_ENV;
    }
    public static get mongoDBUri(): string {
        return (this.environment === "production") ? process.env["MONGODB_URI"] : process.env["MONGODB_URI_LOCAL"];
    }
    public static loadFile() {
        if (fs.existsSync(".env")) {
            logger.debug("cargando variables de entorno desde archivo .env");
            dotenv.config({ path: ".env" });
        }
    }
}

export default EnvironmentConfig;