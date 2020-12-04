"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
const CompiledResponseHeader_1 = require("./CompiledResponseHeader");
const CompiledMediaType_1 = require("./CompiledMediaType");
class CompiledResponse {
    constructor(response, options) {
        this.content = {};
        this.compiledResponseHeader = new CompiledResponseHeader_1.default(response.headers, options);
        if (response.content) {
            this.content = Object.keys(response.content).reduce((compiled, name) => {
                compiled[name] = new CompiledMediaType_1.default(name, response.content[name], options.responseBodyAjvOptions || {});
                return compiled;
            }, {});
        }
    }
    validate(response) {
        this.compiledResponseHeader.validate(response.header);
        const contentType = CompiledMediaType_1.default.extractMediaType(response.header["content-type"]);
        /**
         * In the case where there is no Content-Type header. For example 204 status.
         */
        if (!contentType) {
            return response.body;
        }
        if (this.content[contentType]) {
            return this.content[contentType].validate(response.body);
        }
        else {
            throw new error_1.default("Unsupported Response Media Type", {
                in: "response",
            });
        }
    }
}
exports.default = CompiledResponse;
//# sourceMappingURL=CompiledResponse.js.map