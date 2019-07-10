import { prepareDB, AnyModelClass } from "../util/helpers";
import { RepositoryBase } from "../../src/repositories/RepositoryBase";


describe("RepositoryBase", () => {
    const anyModelObj = () => new AnyModelClass({ anyProp: 2 });
    const anyRepo = () => new RepositoryBase<AnyModelClass>(AnyModelClass);

    beforeAll(prepareDB);

    it("should persist a new document on create", async () => {
        // arrange
        const obj = anyModelObj();
        const repo = anyRepo();
        // act
        const created = await repo.create(obj);
        // assert
        expect(created._id).toBeDefined();
        expect(created.anyProp).toBe(obj.anyProp);

    });
    it("should update a persisted object on update", async () => {
        // arrange
        let obj = anyModelObj();
        obj = await obj.getModelForClass(AnyModelClass).create(obj);
        const repo = anyRepo();
        const newValue = obj.anyProp + 1;
        obj.anyProp = newValue;

        // act
        const updateRes = await repo.update(obj._id, obj);
        // assert
        expect(updateRes.ok).toBe(1);
        expect(updateRes.nModified).toBe(1);
        const updated = await new AnyModelClass().getModelForClass(AnyModelClass).findById(obj._id).exec();
        expect(updated.anyProp).toEqual(newValue);
    });
    it("should remove a persisted object on delete", async () => {
        // arrange
        const objDB = new AnyModelClass().getModelForClass(AnyModelClass);
        const obj = await objDB.create(anyModelObj());
        const repo = anyRepo();

        // act
        await repo.delete(obj._id.toHexString());

        // assert
        const res = await objDB.findById(obj._id).exec();
        expect(res).toBeNull();
    });
    it("should found a persisted object on findById", async () => {
        // arrange
        const objDB = new AnyModelClass().getModelForClass(AnyModelClass);
        const obj = await objDB.create(anyModelObj());
        const repo = anyRepo();

        // act
        const res = await repo.findById(obj._id.toHexString());

        // assert
        expect(res._id).toEqual(obj._id);
    });
    it("should get all persisted objects on retrieve", async () => {
        // arrange
        const objDB = new AnyModelClass().getModelForClass(AnyModelClass);
        const obj = await objDB.create(anyModelObj());
        const repo = anyRepo();

        // act
        const res = await repo.retrieve();

        // assert
        const dbRes = await objDB.find({}).exec();
        expect(res.length).toBe(dbRes.length);
        expect(res.map(o => o._id)).toEqual(dbRes.map(o => o._id));
    });
    it("should find persisted objects by pattern on criteria object", async () => {
        const repo = anyRepo();

        repo.create(new AnyModelClass({ anyProp: "email", anotherProp: "nombre" }));

        repo.findLike({ anyProp: "ema" });
    });
});