import { HttpExceptionBuilder } from "../../src/exceptions/HttpExceptionBuilder";
import { BaseError } from "../../src/models/exceptions/BaseError";
import { HttpException } from "../../src/exceptions/HttpException";
describe("HttpExceptionBuilder", () => {

    it("should build an instance with default status & msg for unknown BaseError instance", () => {
        // arrange
        const anyCustomMsg = "custom message";
        const baseErrorMsg = "base error message";
        const baseError = new BaseError(baseErrorMsg);
        // act
        const httpError = new HttpExceptionBuilder(baseError)
            .message(anyCustomMsg)
            .build();
        // assert
        expect(httpError).toBeInstanceOf(HttpException);
        expect(httpError.message).toBe(`${anyCustomMsg}: ${baseErrorMsg}`);
        expect(httpError.status).toBe(500);
    });

    it("should build an instance with default status & msg for unknown error", () => {
        // arrange
        const anyCustomMsg = "custom message";
        const unknownErrorMsg = "unknown error message";
        const unknownError = new Error(unknownErrorMsg);
        // act
        const httpError = new HttpExceptionBuilder(unknownError)
            .message(anyCustomMsg)
            .build();
        // assert
        expect(httpError).toBeInstanceOf(HttpException);
        expect(httpError.message).toBe(`${anyCustomMsg}`);
        expect(httpError.status).toBe(500);
    });

    it("should build an instance with configured status & default message for a configured error type", () => {
        // arrange
        const knownErrorMsg = "specificErrorMsg";
        class AnyExtendedBaseError extends BaseError {
            constructor() { super(knownErrorMsg); }
        }
        const configuredStatusCode = 409;
        const operationErrorMsg = "Operation error";
        const knownErrorInstance = new AnyExtendedBaseError();
        // act
        const httpError = new HttpExceptionBuilder(knownErrorInstance)
            .message(operationErrorMsg)
            .when(AnyExtendedBaseError, configuredStatusCode)
            .build();
        // assert
        expect(httpError).toBeInstanceOf(HttpException);
        expect(httpError.message).toBe(`${operationErrorMsg}: ${knownErrorMsg}`);
        expect(httpError.status).toBe(configuredStatusCode);
    });
    it("should build an instance with configured status and message for a configured error type", () => {
        // arrange
        const knownErrorMsg = "specificErrorMsg";
        class AnyExtendedBaseError extends BaseError {
            constructor() { super(knownErrorMsg); }
        }
        const configuredStatusCode = 409;
        const configuredStatusMessage = "configured message";

        const operationErrorMsg = "Operation error";
        const knownErrorInstance = new AnyExtendedBaseError();
        // act
        const httpError = new HttpExceptionBuilder(knownErrorInstance)
            .message(operationErrorMsg)
            .when(AnyExtendedBaseError, configuredStatusCode, configuredStatusMessage)
            .build();
        // assert
        expect(httpError).toBeInstanceOf(HttpException);
        expect(httpError.message).toBe(`${operationErrorMsg}: ${configuredStatusMessage}`);
        expect(httpError.status).toBe(configuredStatusCode);
    });
});