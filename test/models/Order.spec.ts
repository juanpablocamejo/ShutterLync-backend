import { ObjectId } from "mongodb";
import { AnyModelClass } from "../util/helpers";
import { Order } from "../../src/models/Order";
import { OrderItem } from "../../src/models/OrderItem";
import { notDeepEqual } from "assert";
const anyPreviewItemId = new ObjectId("5cad09ca67c5dd378c2850dc");
describe("Order", () => {
    it("addItem should add an item to order", () => {
        // arrange
        const [obj, newItem] = [new Order(), new OrderItem(anyPreviewItemId)];
        // act
        obj.addItem(newItem);
        // assert
        expect(obj.selectedItems).toContain(newItem);
    });
    it("removeItem should remove the previeItem from order", () => {
        // arrange
        const [obj, newItem] = [new Order(), new OrderItem(anyPreviewItemId)];
        obj.addItem(newItem);
        // act
        obj.removeItem(newItem);
        // assert
        expect(obj.selectedItems).not.toContain(newItem);
    });
    it("isConfirmed & isCompleted should be false on new order", () => {
        // arrange
        const obj = new Order();
        // act
        const [confirmed, completed] = [obj.isConfirmed, obj.isCompleted];
        // assert
        expect(confirmed).toBeFalsy();
        expect(completed).toBeFalsy();
    });
    it("confirm should change the order state to CONFIRMED", () => {
        // arrange
        const obj = new Order();
        // act
        obj.confirm();
        // assert
        expect(obj.isConfirmed).toBeTruthy();

    });
    it("complete should change the order state to COMPLETED", () => {
        // arrange
        const obj = new Order();
        // act
        obj.complete();
        // assert
        expect(obj.isCompleted).toBeTruthy();
    });

});