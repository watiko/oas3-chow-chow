"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Ajv = require("ajv");
const options = {
    /**
     * Ignore following formats for now because they are not supported by AJV by default.
     * TODO: Add custom format supports for following formats.
     */
    unknownFormats: [
        "int32",
        "int64",
        "float",
        "double",
        "byte",
        "binary",
        "password",
    ],
    nullable: true,
    jsonPointers: true,
};
function ajv(opts = {}) {
    return new Ajv(Object.assign(Object.assign({}, options), opts));
}
exports.default = ajv;
//# sourceMappingURL=ajv.js.map