import { BaseObject } from "../../src/models/base/BaseObject";
import { ObjectId } from "bson";
import { AnyModelClass } from "../util/helpers";

describe("BaseObject", () => {
    it("constructor should populate all properties passed as argument", () => {
        // arrange
        const [value, idValue, arrVal, objVal] = [2, new ObjectId("5cad09ca67c5dd378c2850dc"), [1], { _id: "123456" } as any as AnyModelClass];

        const obj: Partial<AnyModelClass> = {
            anyProp: value,
            _id: idValue,
            arrayProp: arrVal,
            objProp: objVal,
            propWithDefValue1: 2
        } as Partial<AnyModelClass>;

        // act
        const res = new AnyModelClass(obj);

        // assert
        expect(res._id).toBe(idValue);
        expect(res.anyProp).toBe(value);
        expect(res.arrayProp).toBe(arrVal);
        expect(res.objProp).toBe(objVal);
        expect(res.propWithDefValue1).toBe(2);

    });
    it("equals should return true only for equivalent objects", () => {
        // arrange
        const obj1 = new AnyModelClass({ anyProp: 1 });
        const obj2 = new AnyModelClass({ anyProp: 1 });
        const obj3 = new AnyModelClass({ anyProp: 2 });


        // act
        const resTrue = obj1.equals(obj2);
        const resFalse = obj1.equals(obj3);

        // assert
        expect(resTrue).toBeTruthy();
        expect(resFalse).toBeFalsy();

    });
    it("eql should return true only for objects with same _id", () => {
        // arrange
        const [id1, id2] = ["5cad09ca67c5dd378c2850dc", "5cad0a308a4a2d11dc7c8837"];
        const obj1 = new AnyModelClass({ anyProp: 1, _id: new ObjectId(id1) });
        const obj2 = new AnyModelClass({ anyProp: 2, _id: new ObjectId(id1) });
        const obj3 = new AnyModelClass({ anyProp: 2, _id: new ObjectId(id2) });


        // act
        const resTrue = obj1.eql(obj2);
        const resFalse = obj1.eql(obj3);

        // assert
        expect(resTrue).toBeTruthy();
        expect(resFalse).toBeFalsy();
    });

});