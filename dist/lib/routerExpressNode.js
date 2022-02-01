"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeExpress = void 0;
var storageRouter = [];
function getRoutes(stack) {
    var routes = (stack || [])
        .filter(function (it) { return it.route || it.name === "router"; })
        .reduce(function (result, it) {
        if (!it.route) {
            var stack_1 = it.handle.stack;
            var routes_1 = getRoutes(stack_1);
            var tt = {
                regexp: it.regexp,
                routes: routes_1,
            };
            storageRouter.push(tt);
            return result.concat(routes_1);
        }
        var methods = it.route.methods;
        var routes = { methods: methods };
        return result.concat(routes);
    }, []);
    return routes;
}
function nodeExpress(request) {
    var entryPoint = request.app._router && request.app._router.stack;
    getRoutes(entryPoint);
    var alterPermissions = [];
    storageRouter
        .map(function (item) { return ({
        name: String(item.regexp).split("/")[2].replace("\\", ""),
        permissions: item.routes,
    }); })
        .filter(function (item) { return !item.name.includes("?"); })
        .forEach(function (item) {
        item.permissions.forEach(function (p) {
            Object.keys(p.methods).forEach(function (m) {
                var methodToUpperCase = m.toUpperCase();
                var methodPatch = methodToUpperCase === "PATCH" ? "UPDATE" : methodToUpperCase;
                var method = methodPatch === "PUT" ? "UPDATE" : methodPatch;
                var result = { method: method, name: item.name };
                alterPermissions.push(result);
            });
        });
    });
    return alterPermissions;
}
exports.nodeExpress = nodeExpress;
