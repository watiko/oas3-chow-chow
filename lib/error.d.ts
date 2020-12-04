import * as betterAjvErrors from "better-ajv-errors";
export interface ChowErrorMeta {
    in: string;
    rawErrors?: betterAjvErrors.IOutputError[];
    code?: number;
}
export default class ChowError extends Error {
    meta: ChowErrorMeta;
    constructor(message: string, meta: ChowErrorMeta);
    toJSON(): {
        code: number;
        location: {
            in: string;
        };
        message: string;
        suggestions: betterAjvErrors.IOutputError[];
    };
}
export declare class RequestValidationError extends ChowError {
    constructor(message: string, meta: ChowErrorMeta);
}
export declare class ResponseValidationError extends ChowError {
    constructor(message: string, meta: ChowErrorMeta);
}
