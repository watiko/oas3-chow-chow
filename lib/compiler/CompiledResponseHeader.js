"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledSchema_1 = require("./CompiledSchema");
const error_1 = require("../error");
class CompiledResponseHeader {
    constructor(headers = {}, options) {
        this.headerSchema = {
            type: "object",
            properties: {},
            required: [],
        };
        /**
         * If a response header is defined with the name "Content-Type", it SHALL be ignored.
         */
        this.ignoreHeaders = ["Content-Type"];
        for (const name in headers) {
            if (this.ignoreHeaders.includes(name)) {
                continue;
            }
            const header = headers[name];
            if (header.schema) {
                this.headerSchema.properties[name] = header.schema;
            }
            if (header.required) {
                this.headerSchema.required.push(name);
            }
        }
        this.compiledSchema = new CompiledSchema_1.default(this.headerSchema, options.headerAjvOptions || {});
    }
    validate(value = {}) {
        try {
            this.compiledSchema.validate(value);
        }
        catch (e) {
            throw new error_1.default("Schema validation error", {
                in: "response-header",
                rawErrors: e,
            });
        }
    }
}
exports.default = CompiledResponseHeader;
//# sourceMappingURL=CompiledResponseHeader.js.map