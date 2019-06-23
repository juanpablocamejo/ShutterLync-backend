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

    it("should return photographer projects when he request all projects", async () => {
        const photographerId = <any>(await new ProjectRepository().findOne()).owner;
        const phoUser = (await new UserRepository().findById(photographerId));
        const expectedProjects = (await new ProjectRepository()
            .find({ owner: phoUser }))
            .map(p => new ProjectQueryDto().fromEntity(p));
        const res = await request(app)
            .get(`/projects`)
            .set("Authorization", `Bearer ${getUserToken(phoUser)}`);
        expect(res.status).toBe(200);
        const getId = (p: ProjectQueryDto) => p.id;
        expect(expectedProjects.length).toBe(res.body.length);
        expectedProjects.map(getId).map(
            (id: string) => expect(res.body.map(getId)).toContain(id)
        );
    });
    it("should return client projects when he request all projects", async () => {
        const client = <any>(await new ProjectRepository().findOne()).client;
        const cliUser: User = (await new UserRepository().findOne({ email: client.email }));
        const expectedProjects = (await (new Project().getModelForClass(Project)
            .find({ "client.email": client.email })))
            .map(p => new ProjectQueryDto().fromEntity(p));
        const res = await request(app)
            .get(`/projects`)
            .set("Authorization", `Bearer ${getUserToken(cliUser)}`);
        expect(res.status).toBe(200);
        const getId = (p: ProjectQueryDto) => p.id;
        expect(expectedProjects.length).toBe(res.body.length);
        expectedProjects.map(getId).map(
            (id: string) => expect(res.body.map(getId)).toContain(id)
        );
    });
    it("should return the filtered project list when photographer request filtering by client email", async () => {
        const anyProj = await new ProjectRepository().findOne();
        const { client, owner } = anyProj;
        const projects = (await new ProjectRepository().find({})).map(p => new ProjectQueryDto().fromEntity(p));
        const clientProjects = projects.filter(p => p.client.email == client.email);
        const phoUser = await new UserRepository().findById(<any>owner);
        const res = await request(app)
            .get(`/projects?client=${client.email}`)
            .set("Authorization", `Bearer ${getUserToken(phoUser)}`);
        expect(res.status).toBe(200);
        const getId = (p: ProjectQueryDto) => p.id;
        expect(clientProjects.length).toBe(res.body.length);
        clientProjects.map(getId).map(
            (id: string) => expect(res.body.map(getId)).toContain(id)
        );
    });

});