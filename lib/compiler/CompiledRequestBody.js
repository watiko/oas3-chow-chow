"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledSchema_1 = require("./CompiledSchema");
const error_1 = require("../error");
class CompiledRequestBody {
    constructor(requestBody, options) {
        this.compiledSchemas = Object.keys(requestBody.content).reduce((compiled, mediaType) => {
            const key = mediaType.toLowerCase(); // normalise
            compiled[key] = new CompiledSchema_1.default(requestBody.content[mediaType].schema || {}, options.requestBodyAjvOptions, { schemaContext: "request" });
            return compiled;
        }, {});
        this.required = !!requestBody.required;
    }
    validate(mediaType, value) {
        if (this.required && !value) {
            throw new error_1.default("Missing required body", { in: "request-body" });
        }
        if (!this.required && !value) {
            return value;
        }
        const compiledSchema = this.findCompiledSchema(mediaType);
        if (!compiledSchema) {
            throw new error_1.default(`Unsupported mediaType: "${mediaType}"`, {
                in: "request-body",
            });
        }
        try {
            compiledSchema.validate(value);
            return value;
        }
        catch (e) {
            throw new error_1.default("Schema validation error", {
                in: "request-body",
                rawErrors: e,
            });
        }
    }
    getDefinedContentTypes() {
        return Object.keys(this.compiledSchemas).filter((type) => this.compiledSchemas.hasOwnProperty(type));
    }
    findCompiledSchema(mediaType) {
        if (!mediaType) {
            mediaType = "*/*";
        }
        mediaType = mediaType.toLowerCase(); // normalise
        if (this.compiledSchemas[mediaType]) {
            return this.compiledSchemas[mediaType];
        }
        // try wildcard
        const parts = mediaType.split("/");
        // mediaTypeRange name taken from https://github.com/OAI/OpenAPI-Specification/pull/1295/files
        const mediaTypeRange = parts[0] + "/*";
        if (this.compiledSchemas[mediaTypeRange]) {
            return this.compiledSchemas[mediaTypeRange];
        }
        return this.compiledSchemas["*/*"]; // last choice, may be undefined.
    }
}
exports.default = CompiledRequestBody;
//# sourceMappingURL=CompiledRequestBody.js.map