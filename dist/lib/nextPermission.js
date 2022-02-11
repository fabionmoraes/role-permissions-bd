"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NextPermission = void 0;
var NextPermission = function (_a) {
    var request = _a.request, userRoles = _a.userRoles, _b = _a.roleNameNext, roleNameNext = _b === void 0 ? "admin" : _b;
    var pathname = request.originalUrl;
    var roleNames = userRoles.map(function (item) { return item.slug; });
    if (roleNames.includes(roleNameNext)) {
        return true;
    }
    var userPermissions = userRoles.map(function (role) { return role.permissions; });
    var permission = userPermissions
        .flat()
        .find(function (item) { return pathname.includes(item.name); });
    if (permission &&
        Object.keys(permission).length &&
        permission.permissions[request.method] === true) {
        return true;
    }
};
exports.NextPermission = NextPermission;
