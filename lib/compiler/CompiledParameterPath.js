"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledSchema_1 = require("./CompiledSchema");
const error_1 = require("../error");
class CompiledParameterPath {
    constructor(parameters, options) {
        this.pathSchema = {
            type: "object",
            properties: {},
            required: [],
        };
        for (const parameter of parameters) {
            this.pathSchema.properties[parameter.name] = parameter.schema || {};
            /**
             * All path parameters are required
             */
            this.pathSchema.required.push(parameter.name);
        }
        /**
         * We want query to coerce to array if needed
         * For example:
         *   `/pets/123` will be valid against a schema with type=number even if `123` is string
         */
        this.compiledSchema = new CompiledSchema_1.default(this.pathSchema, Object.assign({ coerceTypes: true }, (options.pathAjvOptions ? options.pathAjvOptions : {})));
    }
    /**
     * If there is no path passed in, we make it an empty object
     */
    validate(value) {
        try {
            const coercedValue = Object.assign({}, value);
            this.compiledSchema.validate(coercedValue);
            return coercedValue;
        }
        catch (e) {
            throw new error_1.default("Schema validation error", {
                in: "path",
                rawErrors: e,
            });
        }
    }
}
exports.default = CompiledParameterPath;
//# sourceMappingURL=CompiledParameterPath.js.map