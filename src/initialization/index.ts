import DataAccess from "../config/dataAccess";
import { createTestProject, resetDB } from "./initialization";
import Environment from "../config/environment";

Environment.loadFile();
DataAccess.connect();
DataAccess.mongooseInstance.then(async () => {
    console.log("eliminando base de datos");
    await resetDB();
    console.log("cargando datos de prueba");
    await createTestProject();
    console.log("tarea finalizada. ");
    process.exit(0);
});