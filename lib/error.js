"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChowError extends Error {
    constructor(message, meta) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(message);
        this.name = this.constructor.name;
        // Custom debugging information
        this.meta = meta;
    }
    toJSON() {
        return {
            code: this.meta.code || 400,
            location: {
                in: this.meta.in,
            },
            message: this.message,
            suggestions: this.meta.rawErrors || [],
        };
    }
}
exports.default = ChowError;
class RequestValidationError extends ChowError {
    constructor(message, meta) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(`RequestValidationError: ${message}`, meta);
    }
}
exports.RequestValidationError = RequestValidationError;
class ResponseValidationError extends ChowError {
    constructor(message, meta) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(`ResponseValidationError: ${message}`, meta);
    }
}
exports.ResponseValidationError = ResponseValidationError;
//# sourceMappingURL=error.js.map