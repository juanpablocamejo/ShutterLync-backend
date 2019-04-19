import request from "supertest";
import { resetDB, prepareDB, prepareServer } from "../util/helpers";
import ProjectRepository from "../../src/app/repositories/projectRepository";
import { Project } from "../../src/app/models/project";
import { InstanceType } from "typegoose";

jest.setTimeout(300000);

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
});