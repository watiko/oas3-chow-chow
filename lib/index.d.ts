import * as Ajv from "ajv";
import { OpenAPIObject } from "openapi3-ts";
import { RequestMeta, ResponseMeta } from "./compiler";
/**
 * Export Errors so that consumers can use it to ditinguish different error type.
 */
export { default as ChowError, RequestValidationError, ResponseValidationError, } from "./error";
export interface ChowOptions {
    headerAjvOptions: Ajv.Options;
    cookieAjvOptions: Ajv.Options;
    pathAjvOptions: Ajv.Options;
    queryAjvOptions: Ajv.Options;
    requestBodyAjvOptions: Ajv.Options;
    responseBodyAjvOptions: Ajv.Options;
}
export default class ChowChow {
    private compiledPaths;
    private compiledOperationById;
    private deprecateValidateRequest;
    private deprecateValidateResponse;
    constructor(document: OpenAPIObject, options?: Partial<ChowOptions>);
    validateRequest(path: string, request: RequestMeta & {
        method: string;
    }): RequestMeta;
    validateResponse(path: string, response: ResponseMeta & {
        method: string;
    }): ResponseMeta;
    validateRequestByPath(path: string, method: string, request: RequestMeta): RequestMeta;
    validateResponseByPath(path: string, method: string, response: ResponseMeta): ResponseMeta;
    validateRequestByOperationId(operationId: string, request: RequestMeta): RequestMeta;
    validateResponseByOperationId(operationId: string, response: ResponseMeta): ResponseMeta;
    getDefinedRequestBodyContentType(path: string, method: string): string[];
    private identifyCompiledPath;
}
