"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledRequestBody_1 = require("./CompiledRequestBody");
const CompiledResponse_1 = require("./CompiledResponse");
const error_1 = require("../error");
const CompiledParameterHeader_1 = require("./CompiledParameterHeader");
const CompiledParameterQuery_1 = require("./CompiledParameterQuery");
const CompiledParameterPath_1 = require("./CompiledParameterPath");
const CompiledParameterCookie_1 = require("./CompiledParameterCookie");
const CompiledMediaType_1 = require("./CompiledMediaType");
class CompiledOperation {
    constructor(operation, inheritedParameter, options) {
        this.header = new Map();
        this.query = new Map();
        this.path = new Map();
        this.cookie = new Map();
        this.response = {};
        const parameters = !!operation.parameters
            ? [...inheritedParameter, ...operation.parameters]
            : [...inheritedParameter];
        for (const parameter of parameters) {
            switch (parameter.in) {
                case "header":
                    this.header.set(parameter.name, parameter);
                    break;
                case "query":
                    this.query.set(parameter.name, parameter);
                    break;
                case "path":
                    this.path.set(parameter.name, parameter);
                    break;
                case "cookie":
                    this.cookie.set(parameter.name, parameter);
                    break;
            }
        }
        this.compiledHeader = new CompiledParameterHeader_1.default(Array.from(this.header.values()), options);
        this.compiledQuery = new CompiledParameterQuery_1.default(Array.from(this.query.values()), options);
        this.compiledPath = new CompiledParameterPath_1.default(Array.from(this.path.values()), options);
        this.compiledCookie = new CompiledParameterCookie_1.default(Array.from(this.cookie.values()), options);
        if (operation.requestBody) {
            this.body = new CompiledRequestBody_1.default(operation.requestBody, options);
        }
        this.operationId = operation.operationId;
        this.response = Object.keys(operation.responses).reduce((compiled, status) => {
            compiled[status] = new CompiledResponse_1.default(operation.responses[status], options);
            return compiled;
        }, {});
    }
    getDefinedRequestBodyContentType() {
        return this.body ? this.body.getDefinedContentTypes() : [];
    }
    validateRequest(request) {
        const header = this.compiledHeader.validate(request.header);
        const query = this.compiledQuery.validate(request.query);
        const path = this.compiledPath.validate(request.path);
        const cookie = this.compiledCookie.validate(request.cookie);
        let body;
        if (this.body) {
            const contentType = CompiledMediaType_1.default.extractMediaType(request.header && request.header["content-type"]);
            body = this.body.validate(contentType, request.body);
        }
        return {
            operationId: request.operationId || this.operationId,
            header,
            query,
            path,
            cookie,
            body,
        };
    }
    validateResponse(response) {
        const compiledResponse = this.response[response.status] || this.response["default"];
        if (compiledResponse) {
            return Object.assign(Object.assign({}, response), { body: compiledResponse.validate(response) });
        }
        else {
            throw new error_1.default("Unsupported Response Status Code", {
                in: "response",
            });
        }
    }
}
exports.default = CompiledOperation;
//# sourceMappingURL=CompiledOperation.js.map