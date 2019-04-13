import { Ref, arrayProp, prop } from "typegoose";
import { PreviewItem } from "./previewItem";

export class Order {
    @arrayProp({ itemsRef: PreviewItem })
    selectedItems: Ref<PreviewItem>;
    @prop()
    confirmed = false;
}