"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllRouters = void 0;
var routerExpress_1 = __importDefault(require("./routerExpress"));
function AllRouters(request, data) {
    var permissions = [];
    var removeDuplicate = [];
    var methods = [];
    var routers = (0, routerExpress_1.default)(request);
    routers.forEach(function (r) {
        var _a, _b;
        if (methods.length) {
            var methodFindIndex = methods.findIndex(function (item) { return item.name === r.name; });
            if (methods[methodFindIndex]) {
                methods[methodFindIndex] = {
                    name: methods[methodFindIndex].name,
                    permissions: __assign(__assign({}, methods[methodFindIndex].permissions), (_a = {}, _a[r.method] = false, _a)),
                };
            }
        }
        methods.push({
            name: r.name,
            permissions: (_b = {},
                _b[r.method] = false,
                _b),
        });
        var findM = methods.findIndex(function (item) { return item.name === r.name; });
        permissions.push(methods[findM]);
    });
    permissions.map(function (p) {
        var getP = removeDuplicate.find(function (i) { return i.name === p.name; });
        if (getP) {
            var getF = removeDuplicate.findIndex(function (i) { return i.name === getP.name; });
            removeDuplicate[getF] = p;
        }
        else {
            removeDuplicate.push(p);
        }
    });
    if (data) {
        var exclude = data.exclude;
        if (exclude) {
            exclude.forEach(function (item) {
                var index = removeDuplicate.findIndex(function (i) { return i.name === item; });
                if (index !== -1)
                    removeDuplicate.splice(index, 1);
            });
        }
    }
    return removeDuplicate;
}
exports.AllRouters = AllRouters;
