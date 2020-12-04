"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledOperation_1 = require("./CompiledOperation");
const error_1 = require("../error");
class CompiledPathItem {
    constructor(pathItemObject, path, options) {
        this.compiledOperationsByMethod = new Map();
        CompiledPathItem.SupportedMethod.forEach((method) => {
            const operationObject = pathItemObject[method];
            if (!operationObject) {
                return;
            }
            const compiledOperation = new CompiledOperation_1.default(operationObject, pathItemObject.parameters || [], options);
            this.compiledOperationsByMethod.set(method, compiledOperation);
            if (operationObject.operationId &&
                options.registerCompiledOperationWithId) {
                options.registerCompiledOperationWithId(operationObject.operationId, compiledOperation);
            }
        });
        this.path = path;
    }
    getDefinedRequestBodyContentType(method) {
        const m = method.toLowerCase();
        const compiledOperation = this.compiledOperationsByMethod.get(m);
        return !!compiledOperation
            ? compiledOperation.getDefinedRequestBodyContentType()
            : [];
    }
    validateRequest(method, request) {
        const mt = method.toLowerCase();
        const compiledOperation = this.compiledOperationsByMethod.get(mt);
        if (!compiledOperation) {
            throw new error_1.default(`Invalid request method - ${mt}`, { in: "path" });
        }
        return compiledOperation.validateRequest(request);
    }
    validateResponse(method, response) {
        const mt = method.toLowerCase();
        const compiledOperation = this.compiledOperationsByMethod.get(mt);
        if (!compiledOperation) {
            throw new error_1.default(`Invalid request method - ${mt}`, { in: "path" });
        }
        return compiledOperation.validateResponse(response);
    }
}
exports.default = CompiledPathItem;
CompiledPathItem.SupportedMethod = [
    "get",
    "post",
    "put",
    "patch",
    "delete",
    "head",
    "options",
    "trace",
];
//# sourceMappingURL=CompiledPathItem.js.map