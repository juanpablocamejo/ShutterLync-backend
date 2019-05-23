import { BaseController } from "../../src/controllers/BaseController";
import _ from "lodash";
import express from "express";
import { getRoutes } from "../util/helpers";

describe("BaseController", () => {
    it("config should add route handlers to the express app", () => {
        // arrange
        class AnyController extends BaseController {
            async getHandler(req: Express.Request, res: Express.Response) {
            }
            async postHandler(req: Express.Request, res: Express.Response) {
            }
            initializeRoutes() {
                this.get("/resource", this.getHandler.bind(this));
                this.post("/resource", this.postHandler.bind(this));
            }
        }

        // act
        const app = express();
        new AnyController().config(app);

        const routes = getRoutes(app._router.stack);
        console.log(routes);
        // assert
        expect(routes["/resource"]).toBeDefined();
        expect(routes["/resource"]).toContain("get");
        expect(routes["/resource"]).toContain("post");
    });
});