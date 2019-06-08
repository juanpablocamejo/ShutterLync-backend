import request from "supertest";
import { resetDB, prepareDB, prepareServer, validPassword, getUserToken } from "../util/helpers";
import { ProjectRepository } from "../../src/repositories/ProjectRepository";
import { Project } from "../../src/models/Project";
import { InstanceType } from "typegoose";
import { User } from "../../src/models/User";
import { ProjectQueryDto } from "../../src/dto/ProjectQueryDto";
import { UserRepository } from "../../src/repositories/UserRepository";
import { ObjectId } from "bson";

jest.setTimeout(10000);

describe("project API", () => {
    let app: any;
    beforeAll(async () => {
        await prepareDB(); app = await prepareServer();
    });
    afterAll(resetDB);

    it("should return 401 when request without valid token", async () => {
        const project: InstanceType<Project> = await new ProjectRepository().findOne();
        const res = await request(app).get(`/projects/${project._id}`);
        expect(res.status).toBe(401);
    });

    it("should return a project when request by id", async () => {
        const project: InstanceType<Project> = await new ProjectRepository().findOne();
        const owner: User = await new UserRepository().findById((<ObjectId>project.owner).toHexString());
        const res = await request(app)
            .get(`/projects/${project._id}`)
            .set("Authorization", `Bearer ${getUserToken(owner)}`);
        expect(JSON.stringify(new ProjectQueryDto().fromEntity(project))).toEqual(JSON.stringify(res.body));
        expect(res.status).toBe(200);
    });

    it("should return the project list when request by client email", async () => {
        const client = (await new ProjectRepository().findOne()).client;
        const user = await new UserRepository().findLike({ email: client.email });
        const res = await request(app)
            .get(`/projects?clientEmail=${client.email}`)
            .set("Authorization", `Bearer ${getUserToken(user[0])}`);

        expect(res.status).toBe(200);
        expect(res.body[0].title).toBeDefined();
    });

});