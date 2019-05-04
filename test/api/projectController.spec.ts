import request from "supertest";
import { resetDB, prepareDB, prepareServer } from "../util/helpers";
import { ProjectRepository } from "../../src/repositories/projectRepository";
import { Project } from "../../src/models/project";
import { InstanceType } from "typegoose";
import { User } from "../../src/models/User";
import { UserRole } from "../../src/models/enums/UserRole";

jest.setTimeout(10000);

describe("project API", () => {
    let app: any;
    beforeAll(async () => { await prepareDB(); app = await prepareServer(); });
    afterAll(resetDB);

    it("should return a project when request by id", async () => {
        const project: InstanceType<Project> = await new ProjectRepository().findOne();
        const res = await request(app).get(`/projects/${project._id}`);
        expect(JSON.stringify(project)).toEqual(JSON.stringify(res.body));
        expect(res.status).toBe(200);
    });

    it("should return the project list when request by clientid", async () => {
        try {
            const clientId = (await new ProjectRepository().findOne()).client;
            console.log(clientId);
            const res = await request(app).get(`/projects?clientId=${clientId}`);
            expect(res.status).toBe(200);
            expect(res.body[0].title).toBeDefined();
        } catch (e) {
            console.log(e);
            throw e;
        }

    });
});