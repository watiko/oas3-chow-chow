"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledSchema_1 = require("./CompiledSchema");
const error_1 = require("../error");
const querystring = require("querystring");
class CompiledParameterQuery {
    constructor(parameters, options) {
        this.querySchema = {
            type: "object",
            properties: {},
            required: [],
        };
        for (const parameter of parameters) {
            this.querySchema.properties[parameter.name] = parameter.schema || {};
            if (parameter.required) {
                this.querySchema.required.push(parameter.name);
            }
        }
        /**
         * We want path to coerce type in general
         * For example:
         *   `?query=x` will be valid against a schema with type=array
         */
        this.compiledSchema = new CompiledSchema_1.default(this.querySchema, Object.assign({ coerceTypes: "array" }, (options.queryAjvOptions ? options.queryAjvOptions : {})));
    }
    /**
     * If there is no query passed in, we make it an empty object
     */
    validate(value = {}) {
        try {
            /**
             * unescape the query if neccessary
             */
            const coercedValue = Object.keys(value).reduce((result, key) => {
                if (typeof value[key] === "string") {
                    result[key] = querystring.unescape(value[key]);
                }
                else {
                    result[key] = value[key];
                }
                return result;
            }, {});
            this.compiledSchema.validate(coercedValue);
            return coercedValue;
        }
        catch (e) {
            throw new error_1.default("Schema validation error", {
                in: "query",
                rawErrors: e,
            });
        }
    }
}
exports.default = CompiledParameterQuery;
//# sourceMappingURL=CompiledParameterQuery.js.map