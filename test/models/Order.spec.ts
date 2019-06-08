import { ObjectId } from "mongodb";
import { Order } from "../../src/models/Order";
import { OrderItem } from "../../src/models/OrderItem";
import { OrderState } from "../../src/models/enums/OrderState";
import { InvalidOperationError } from "../../src/models/exceptions/InvalidOperationError";
const anyPreviewItemId = new ObjectId("5cad09ca67c5dd378c2850dc");

describe("Order", () => {
    it("default order state should be PENDING", () => {
        // arrange & act
        const obj = new Order();
        // assert
        expect(obj.state).toBe(OrderState.PENDING);
    });
    it("addItem should add an item to order", () => {
        // arrange
        const [obj, newItem] = [new Order(), new OrderItem(anyPreviewItemId)];
        // act
        obj.addItem(newItem);
        // assert
        expect(obj.orderItems).toContain(newItem);
    });
    it("removeItem should remove the previeItem from order", () => {
        // arrange
        const [obj, newItem] = [new Order(), new OrderItem(anyPreviewItemId)];
        obj.addItem(newItem);
        // act
        obj.removeItem(newItem);
        // assert
        expect(obj.orderItems).not.toContain(newItem);
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

    it("confirm should throw an exception if order is already confirmed", () => {
        // arrange
        const obj = new Order([], OrderState.CONFIRMED);
        // act & assert
        expect(() => obj.confirm()).toThrowError(InvalidOperationError);

    });
    it("complete should throw an exception if order is pending", () => {
        // arrange
        const obj = new Order();
        // act & assert
        expect(() => obj.complete()).toThrowError(InvalidOperationError);

    });
    it("complete should throw an exception if order is already completed", () => {
        // arrange
        const obj = new Order([], OrderState.COMPLETED);
        // act & assert
        expect(() => obj.complete()).toThrowError(InvalidOperationError);

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
        const obj = new Order([], OrderState.CONFIRMED);
        // act
        obj.complete();
        // assert
        expect(obj.isCompleted).toBeTruthy();
    });

});