import { Project } from "../../src/models/project";
import { PreviewItem } from "../../src/models/previewItem";
import { ObjectId } from "mongodb";
import { OrderItem } from "../../src/models/OrderItem";

const anyPreviewItemId = new ObjectId("5cad09ca67c5dd378c2850dc");
describe("Project", () => {
    it("addPreviewItem should add an item to the project", () => {
        // arrange
        const previewItem = new PreviewItem();
        const proj = new Project({
            title: "project title"
        });
        // act
        proj.addPreviewItem(previewItem);
        // assert
        expect(proj.previewItems).toContain(previewItem);
    });
    it("removePreviewItem should remove an item from the project", () => {
        // arrange
        const previewItem = new PreviewItem({ _id: anyPreviewItemId });
        const proj = new Project({
            title: "project title"
        });
        proj.addPreviewItem(previewItem);
        // act
        proj.removePreviewItem(previewItem);
        // assert
        expect(proj.previewItems).not.toContain(previewItem);
    });
    it("AddToOrder should add an item to the project´s order", () => {
        // arrange
        const proj = new Project({
            title: "project title"
        });
        const orderItem = new OrderItem(anyPreviewItemId);
        // act
        proj.addToOrder(orderItem);
        // assert
        expect(proj.order.selectedItems.length).toBe(1);
        expect(proj.order.selectedItems[0]).toBe(orderItem);
    });
    it("removeFromOrder should remove an item from the project´s order", () => {
        // arrange
        const proj = new Project({
            title: "project title"
        });
        const orderItem = new OrderItem(anyPreviewItemId);
        proj.addToOrder(orderItem);
        // act
        proj.removeFromOrder(orderItem);
        // assert
        expect(proj.order.selectedItems.length).toBe(0);
    });
});