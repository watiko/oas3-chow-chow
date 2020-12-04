"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CompiledPathItem_1 = require("./CompiledPathItem");
const XRegExp = require("xregexp");
class CompiledPath {
    constructor(path, pathItemObject, options) {
        this.ignoredMatches = ["index", "input"];
        this.extractPathParams = (path) => {
            const matches = XRegExp.exec(path, this.regex);
            // extract path parameters
            return Object.keys(matches)
                .filter(this.matchFilter.bind(this))
                .reduce((obj, key) => {
                return Object.assign(Object.assign({}, obj), { [key]: matches[key] });
            }, {});
        };
        this.matchFilter = (key) => {
            return isNaN(parseInt(key)) && !this.ignoredMatches.includes(key);
        };
        this.path = path;
        /**
         * The following statement should create Named Capturing Group for
         * each path parameter, for example
         * /pets/{petId} => ^/pets/(?<petId>[^/]+)/?$
         */
        (this.regex = XRegExp("^" + path.replace(/\{([^}]*)}/g, "(?<$1>[^/]+)") + "/?$")),
            (this.compiledPathItem = new CompiledPathItem_1.default(pathItemObject, path, options));
    }
    getDefinedRequestBodyContentType(method) {
        return this.compiledPathItem.getDefinedRequestBodyContentType(method);
    }
    test(path) {
        return XRegExp.test(path, this.regex);
    }
    validateRequest(path, method, request) {
        return this.compiledPathItem.validateRequest(method, Object.assign(Object.assign({}, request), { path: this.extractPathParams(path) }));
    }
    validateResponse(method, response) {
        return this.compiledPathItem.validateResponse(method, response);
    }
}
exports.default = CompiledPath;
//# sourceMappingURL=CompiledPath.js.map