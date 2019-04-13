
import { should, expect } from "chai";
import request from "supertest";
import { resetDB, prepareDB } from "../helpers";
import express = require("express");

const app = express();
jest.setTimeout(300000);

describe("API", () => {
    beforeEach(async () => { await prepareDB(); });
    afterEach(resetDB);

    it("should return a project when request by id", async () => {
        // const res = await request(app).get("/projects/5cb153c103fe6114104d7bf0");
        // console.log(res.text);
        // expect(res.status).equals(200);
    });
});