import { ParameterObject } from "openapi3-ts";
import { ChowOptions } from "..";
export default class CompiledParameterPath {
    private compiledSchema;
    private pathSchema;
    constructor(parameters: ParameterObject[], options: Partial<ChowOptions>);
    /**
     * If there is no path passed in, we make it an empty object
     */
    validate(value: any): any;
}
