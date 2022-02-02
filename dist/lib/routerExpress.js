"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var routerExpressNode_1 = require("./routerExpressNode");
function routerExpress(request, prefix) {
    var routes = request.app._router.stack;
    var routers = routes
        .map(function (layer) {
        var _a, _b;
        if (layer.route) {
            var path = (_a = layer.route) === null || _a === void 0 ? void 0 : _a.path;
            var method = (_b = layer.route) === null || _b === void 0 ? void 0 : _b.stack[0].method;
            var methodPatch = method === "patch" ? "update" : method;
            var alterMethod = methodPatch === "put" ? "update" : methodPatch;
            var alterPath = "";
            if (prefix) {
                alterPath = path.includes(prefix)
                    ? path.replace("/".concat(prefix), "")
                    : "";
            }
            if (!path.includes("auth") && !path.includes("me")) {
                var pathSplit = alterPath
                    ? alterPath.split("/")[1]
                    : path.split("/")[1];
                return {
                    method: alterMethod.toUpperCase(),
                    name: pathSplit,
                };
            }
        }
    })
        .filter(function (item) { return item !== undefined; })
        .filter(function (item) { return (item === null || item === void 0 ? void 0 : item.name) !== undefined; });
    if (routers.length === 0) {
        return (0, routerExpressNode_1.nodeExpress)(request);
    }
    if (prefix) {
        return routers.filter(function (r) { return !r.name.includes(prefix); });
    }
    return routers;
}
exports.default = routerExpress;
