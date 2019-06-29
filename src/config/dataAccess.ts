import Mongoose, { MongooseThenable } from "mongoose";
import Environment from "./environment";

class DataAccess {
    private static _mongooseConnection: Mongoose.Connection;
    private static _mongooseInstance: MongooseThenable;

    private constructor() { }

    public static get mongooseConnection(): Mongoose.Connection {
        if (!this._mongooseConnection) this.connect();
        return this._mongooseConnection;
    }
    public static get mongooseInstance(): Mongoose.MongooseThenable {
        if (!this._mongooseInstance) this.connect();
        return this._mongooseInstance;
    }

    public static connect(uri?: string): Mongoose.MongooseThenable | undefined {
        if (this._mongooseConnection) return;
        this._mongooseConnection = Mongoose.connection;
        this._mongooseConnection.once("open", () => {
            // console.log("Conectado a mongodb.");
        });
        this._mongooseInstance = Mongoose.connect(uri || Environment.mongoDBUri!, { useNewUrlParser: true } as Mongoose.ConnectionOptions);
        return this._mongooseInstance;
    }

}

export default DataAccess;
