"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledSchema_1 = require("./CompiledSchema");
const error_1 = require("../error");
class CompiledMediaType {
    constructor(name, mediaType, opts) {
        this.name = name;
        this.compiledSchema = new CompiledSchema_1.default(mediaType.schema || {}, opts || {}, { schemaContext: "response" });
    }
    validate(value) {
        try {
            this.compiledSchema.validate(value);
            return value;
        }
        catch (e) {
            throw new error_1.default("Schema validation error", {
                in: `media-type:${this.name}`,
                rawErrors: e,
            });
        }
    }
    static extractMediaType(contentType) {
        if (!contentType) {
            return;
        }
        return contentType.split(";")[0];
    }
}
exports.default = CompiledMediaType;
//# sourceMappingURL=CompiledMediaType.js.map