"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const betterAjvErrors = require("better-ajv-errors");
const ajv_1 = require("./ajv");
class CompiledSchema {
    constructor(schema, opts, context) {
        this.schemaObject = schema;
        const ajvInstance = ajv_1.default(opts);
        ajvInstance.removeKeyword("writeOnly");
        ajvInstance.removeKeyword("readOnly");
        ajvInstance.addKeyword("writeOnly", {
            validate: (schema) => schema ? context.schemaContext === "request" : true,
        });
        ajvInstance.addKeyword("readOnly", {
            validate: (schema) => schema ? context.schemaContext === "response" : true,
        });
        this.ajvInstance = ajvInstance;
    }
    get validator() {
        if (!this._validator) {
            this._validator = this.ajvInstance.compile(this.schemaObject);
        }
        return this._validator;
    }
    validate(value) {
        const valid = this.validator(value);
        if (!valid) {
            const errors = betterAjvErrors(this.schemaObject, value || "", this.validator.errors, { format: "js", indent: 2 });
            /**
             * In the case where betterAjvErrors accidently return 0 errors
             * we return raw errors
             */
            if (Array.isArray(errors) && errors.length > 0) {
                throw errors;
            }
            throw this.validator.errors;
        }
    }
}
exports.default = CompiledSchema;
//# sourceMappingURL=CompiledSchema.js.map