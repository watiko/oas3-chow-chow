"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledSchema_1 = require("./CompiledSchema");
const error_1 = require("../error");
class CompiledParameterHeader {
    constructor(parameters, options) {
        this.headerSchema = {
            type: "object",
            properties: {},
            required: [],
            // All header properties should be a string, no?
            additionalProperties: { type: "string" },
        };
        /**
         * If in is "header" and the name field is "Accept", "Content-Type" or "Authorization",
         * the parameter definition SHALL be ignored.
         */
        this.ignoreHeaders = [
            "Accept",
            "Content-Type",
            "Authorization",
        ].map((header) => header.toLowerCase());
        for (const parameter of parameters) {
            const headerName = parameter.name.toLowerCase();
            if (this.ignoreHeaders.includes(headerName)) {
                continue;
            }
            this.headerSchema.properties[headerName] = parameter.schema || {};
            if (parameter.required) {
                this.headerSchema.required.push(headerName);
            }
        }
        this.compiledSchema = new CompiledSchema_1.default(this.headerSchema, options.headerAjvOptions);
    }
    /**
     * If there is no header passed in, we make it an empty object
     */
    validate(value = {}) {
        try {
            this.compiledSchema.validate(value);
            return value;
        }
        catch (e) {
            throw new error_1.default("Schema validation error", {
                in: "header",
                rawErrors: e,
            });
        }
    }
}
exports.default = CompiledParameterHeader;
//# sourceMappingURL=CompiledParameterHeader.js.map