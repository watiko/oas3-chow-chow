"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledPath_1 = require("./CompiledPath");
const deref = require("json-schema-deref-sync");
function compile(oas, options) {
    const document = deref(oas, { failOnMissing: true });
    if (document instanceof Error) {
        throw document;
    }
    const compiledOperationById = new Map();
    const registerOperationById = (operationId, compiledOperation) => {
        compiledOperationById.set(operationId, compiledOperation);
    };
    const compiledPaths = Object.keys(document.paths).map((path) => {
        const pathItemObject = document.paths[path];
        // TODO: support for base path
        return new CompiledPath_1.default(path, pathItemObject, Object.assign(Object.assign({}, options), { registerCompiledOperationWithId: registerOperationById }));
    });
    return {
        compiledPaths,
        compiledOperationById,
    };
}
exports.default = compile;
//# sourceMappingURL=index.js.map