import DataAccess from "../config/dataAccess";
import { createTestProject, resetDB, createProjectStates, createOrderStates } from "./initialization";
import Environment from "../config/environment";

Environment.loadFile();
DataAccess.connect();
DataAccess.mongooseInstance.then(async () => {
    console.log("eliminando base de datos");
    await resetDB();
    console.log("cargando datos de prueba");
    await createProjectStates();
    await createOrderStates();
    const proj1 = await createTestProject(10);
    await createTestProject(5, undefined, proj1.owner, proj1.client);
    const proj2 = await createTestProject(12, undefined);
    await createTestProject(6, undefined, proj2.owner, proj2.client);
    console.log("tarea finalizada. ");
    process.exit(0);
});