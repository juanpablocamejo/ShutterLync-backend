import { ProjectFilter } from "../../src/services/ProjectFilter";
import { ObjectId } from "bson";
import { ProjectStates } from "../../src/models/enums/ProjectState";

describe("ProjectFilter", () => {
    it("client should map to regex on client.email field", async () => {
        const anyString = "test";
        // arrange
        const filter = new ProjectFilter({ client: anyString });
        // act
        const obj = filter.getMongoFilter();
        // assert
        expect(obj["client.email"])
            .toEqual(new RegExp(filter.client, "i"));
    });
    it("toDate should map to $lte operator on date field", async () => {
        const anyDate = new Date();
        // arrange
        const filter = new ProjectFilter({ toDate: anyDate });
        // act
        const obj = filter.getMongoFilter();
        // assert
        expect(obj["date"])
            .toEqual({ $lte: filter.toDate });
    });
    it("fromDate should map to $gte operator on date field", async () => {
        const anyDate = new Date();
        // arrange
        const filter = new ProjectFilter({ fromDate: anyDate });
        // act
        const obj = filter.getMongoFilter();
        // assert
        expect(obj["date"])
            .toEqual({ $gte: filter.fromDate });
    });
    it("from and to date filters should map to $lte and $gte operators on same date field", async () => {
        const [anyFromDate, anyToDate] = [new Date(2010, 1, 1), new Date(2010, 2, 1)];
        // arrange
        const filter = new ProjectFilter({ fromDate: anyFromDate, toDate: anyToDate });
        // act
        const obj = filter.getMongoFilter();
        // assert
        expect(obj["date"])
            .toEqual({ $gte: filter.fromDate, $lte: filter.toDate });
    });
    it("ownerId should map to same value filter on owner field", async () => {
        const anyId = ObjectId.createFromTime(1);
        // arrange
        const filter = new ProjectFilter({ ownerId: anyId });
        // act
        const obj = filter.getMongoFilter();
        // assert
        expect(obj["owner"])
            .toEqual(filter.ownerId);
    });
    it("states should map to $in operator filter on state field", async () => {
        const anyState = ProjectStates.CREATED;
        // arrange
        const filter = new ProjectFilter({ states: [anyState] });
        // act
        const obj = filter.getMongoFilter();
        // assert
        expect(obj["state"])
            .toEqual({ $in: filter.states });
    });
    it("title should map to regex on title field", async () => {
        const anyString = "test";
        // arrange
        const filter = new ProjectFilter({ title: anyString });
        // act
        const obj = filter.getMongoFilter();
        // assert
        expect(obj["title"])
            .toEqual(new RegExp(filter.title, "i"));
    });
});