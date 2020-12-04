"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const compiler_1 = require("./compiler");
const error_1 = require("./error");
const util = require("util");
/**
 * Export Errors so that consumers can use it to ditinguish different error type.
 */
var error_2 = require("./error");
exports.ChowError = error_2.default;
exports.RequestValidationError = error_2.RequestValidationError;
exports.ResponseValidationError = error_2.ResponseValidationError;
class ChowChow {
    constructor(document, options = {}) {
        this.deprecateValidateRequest = util.deprecate(this.validateRequestByPath.bind(this), "validateRequest() is now deprecated, please use validateRequestByPath or validateRequestByOperationId instead");
        this.deprecateValidateResponse = util.deprecate(this.validateResponseByPath.bind(this), "validateResponse() is now deprecated, please use validateResponseByPath or validateResponseByOperationId instead");
        const { compiledPaths, compiledOperationById } = compiler_1.default(document, options);
        this.compiledPaths = compiledPaths;
        this.compiledOperationById = compiledOperationById;
    }
    validateRequest(path, request) {
        return this.deprecateValidateRequest(path, request.method, request);
    }
    validateResponse(path, response) {
        return this.deprecateValidateResponse(path, response.method, response);
    }
    validateRequestByPath(path, method, request) {
        try {
            const compiledPath = this.identifyCompiledPath(path);
            return compiledPath.validateRequest(path, method, request);
        }
        catch (err) {
            if (err instanceof error_1.default) {
                throw new error_1.RequestValidationError(err.message, err.meta);
            }
            else {
                throw err;
            }
        }
    }
    validateResponseByPath(path, method, response) {
        try {
            const compiledPath = this.identifyCompiledPath(path);
            return compiledPath.validateResponse(method, response);
        }
        catch (err) {
            if (err instanceof error_1.default) {
                throw new error_1.ResponseValidationError(err.message, err.meta);
            }
            else {
                throw err;
            }
        }
    }
    validateRequestByOperationId(operationId, request) {
        const compiledOperation = this.compiledOperationById.get(operationId);
        if (!compiledOperation) {
            throw new error_1.default(`No matches found for the given operationId - ${operationId}`, { in: "request", code: 404 });
        }
        try {
            return compiledOperation.validateRequest(request);
        }
        catch (err) {
            if (err instanceof error_1.default) {
                throw new error_1.RequestValidationError(err.message, err.meta);
            }
            else {
                throw err;
            }
        }
    }
    validateResponseByOperationId(operationId, response) {
        const compiledOperation = this.compiledOperationById.get(operationId);
        if (!compiledOperation) {
            throw new error_1.default(`No matches found for the given operationId - ${operationId}`, { in: "response", code: 404 });
        }
        try {
            return compiledOperation.validateResponse(response);
        }
        catch (err) {
            if (err instanceof error_1.default) {
                throw new error_1.ResponseValidationError(err.message, err.meta);
            }
            else {
                throw err;
            }
        }
    }
    getDefinedRequestBodyContentType(path, method) {
        try {
            const compiledPath = this.identifyCompiledPath(path);
            return compiledPath.getDefinedRequestBodyContentType(method);
        }
        catch (err) {
            if (err instanceof error_1.default) {
                return [];
            }
            else {
                throw err;
            }
        }
    }
    identifyCompiledPath(path) {
        const compiledPath = this.compiledPaths.find((cp) => {
            return cp.test(path);
        });
        if (!compiledPath) {
            throw new error_1.default(`No matches found for the given path - ${path}`, {
                in: "paths",
                code: 404,
            });
        }
        return compiledPath;
    }
}
exports.default = ChowChow;
//# sourceMappingURL=index.js.map