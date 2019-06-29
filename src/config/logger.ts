import { Logger, transports } from "winston";

export class ShutterlyncLogger extends Logger {
    private static _instance?: ShutterlyncLogger = undefined;
    private constructor() {
        super();
    }
    static get instance() {
        if (!ShutterlyncLogger._instance) {
            ShutterlyncLogger._instance = new Logger({
                transports: [
                    new transports.Console({
                        level: process.env.NODE_ENV === "production" ? "error" : "debug"
                    }),
                    new transports.File({
                        filename: "debug.log", level: "debug"
                    })
                ]
            });
        }
        return ShutterlyncLogger._instance;
    }
}

