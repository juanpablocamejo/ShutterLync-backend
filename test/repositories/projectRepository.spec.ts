import { prepareDB } from "../util/helpers";
import { ProjectRepository } from "../../src/repositories/ProjectRepository";
import { PreviewItem } from "../../src/models/previewItem";
import { ObjectId } from "bson";
import ProjectService from "../../src/services/ProjectService";

describe("prueba", () => {
    beforeAll(async () => { await prepareDB(); });
    it("asdf", async () => {
        const repo = new ProjectRepository();
        const proj = await repo.findOne();
        const item = new PreviewItem({ filename: "archivo test" });
        const newItm = await repo.addPreviewItem(proj._id, item);
        expect(newItm._id).toBeDefined();
        expect(newItm.filename).toBe("archivo test");
    });
});