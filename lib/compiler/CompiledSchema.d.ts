import { SchemaObject } from "openapi3-ts";
import * as Ajv from "ajv";
export default class CompiledSchema {
    private schemaObject;
    private ajvInstance;
    private _validator?;
    constructor(schema: SchemaObject, opts?: Ajv.Options, context?: any);
    private get validator();
    validate(value: any): void;
}
