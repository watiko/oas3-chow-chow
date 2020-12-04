"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledSchema_1 = require("./CompiledSchema");
const error_1 = require("../error");
class CompiledParameterCookie {
    constructor(parameters, options) {
        this.cookieSchema = {
            type: "object",
            properties: {},
            required: [],
        };
        for (const parameter of parameters) {
            this.cookieSchema.properties[parameter.name] = parameter.schema || {};
            if (parameter.required) {
                this.cookieSchema.required.push(parameter.name);
            }
        }
        this.compiledSchema = new CompiledSchema_1.default(this.cookieSchema, options.cookieAjvOptions);
    }
    /**
     * If there is no query passed in, we make it an empty object
     */
    validate(value = {}) {
        try {
            this.compiledSchema.validate(value);
            return value;
        }
        catch (e) {
            throw new error_1.default("Schema validation error", {
                in: "cookie",
                rawErrors: e,
            });
        }
    }
}
exports.default = CompiledParameterCookie;
//# sourceMappingURL=CompiledParameterCookie.js.map