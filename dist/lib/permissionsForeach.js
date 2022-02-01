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
Object.defineProperty(exports, "__esModule", { value: true });
function permissionsForeach(role, routers, removeDuplicatePermissions, exclude) {
    var permissions = [];
    role.permissions.forEach(function (elem) {
        var filterRemoveRouters = routers.filter(function (item) { return !item.name.includes(elem.name); });
        permissions.push(elem);
        var methods = [];
        filterRemoveRouters.forEach(function (r) {
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
    });
    permissions.map(function (p) {
        var getP = removeDuplicatePermissions.find(function (i) { return i.name === p.name; });
        if (getP) {
            var getF = removeDuplicatePermissions.findIndex(function (i) { return i.name === getP.name; });
            removeDuplicatePermissions[getF] = p;
        }
        else {
            removeDuplicatePermissions.push(p);
        }
    });
    if (exclude) {
        exclude.forEach(function (item) {
            var index = removeDuplicatePermissions.findIndex(function (i) { return i.name === item; });
            if (index !== -1)
                removeDuplicatePermissions.splice(index, 1);
        });
    }
    return __assign(__assign({}, role), { permissions: removeDuplicatePermissions });
}
exports.default = permissionsForeach;
