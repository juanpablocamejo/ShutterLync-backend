import Mongoose from "mongoose";
import Environment from "./environment";

class DataAccess {
    private static _mongooseConnection: Mongoose.Connection;
    private static _mongooseInstance: any;

    private constructor() { }

    public static get mongooseConnection(): Mongoose.Connection {
        if (!this._mongooseConnection) this.connect();
        return this._mongooseConnection;
    }
    public static get mongooseInstance(): any {
        if (!this._mongooseInstance) this.connect();
        return this._mongooseInstance;
    }

    private static connect(): Mongoose.Connection {

        this._mongooseConnection = Mongoose.connection;
        this._mongooseConnection.once("open", () => {
            console.log("Conectado a mongodb.");
        });

        this._mongooseInstance = Mongoose.connect(Environment.mongoDBUri);
        return this._mongooseInstance;
    }

}

export default DataAccess;
