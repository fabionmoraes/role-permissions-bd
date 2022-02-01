"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoles = void 0;
function UserRoles(userRoles) {
    var roles = userRoles.map(function (role) { return role.role; });
    return roles.map(function (role) {
        role["permissions"] = role.permissions ? JSON.parse(role.permissions) : [];
        return role;
    });
}
exports.UserRoles = UserRoles;
