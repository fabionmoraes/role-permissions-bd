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
exports.Permission = exports.Permissions = void 0;
var routerExpress_1 = __importDefault(require("./routerExpress"));
var permissionsForeach_1 = __importDefault(require("./permissionsForeach"));
var Permissions = function (request, data) {
    var roles = data.roles, exclude = data.exclude;
    var rolesFilter = roles.filter(function (item) { return item.slug !== "admin"; });
    var removeDuplicatePermissions = [];
    var routers = (0, routerExpress_1.default)(request);
    var rolesMap = rolesFilter.map(function (item) { return (__assign(__assign({}, item), { permissions: JSON.parse(item.permissions) })); });
    var roleAlter = rolesMap.map(function (role) {
        return (0, permissionsForeach_1.default)(role, routers, removeDuplicatePermissions, exclude);
    });
    // Percorrer a roles do banco para puxar as permissões
    return roleAlter.map(function (item) { return (__assign(__assign({}, item), { permissions: item.permissions.map(function (p) {
            var getRoles = roles.find(function (r) { return r.slug === item.slug; });
            var getPermissions = JSON.parse(getRoles.permissions);
            var permission = getPermissions.find(function (pp) { return pp.name === p.name; });
            return __assign(__assign({}, p), { permissions: (permission === null || permission === void 0 ? void 0 : permission.permissions) || p.permissions });
        }) })); });
};
exports.Permissions = Permissions;
var Permission = function (request, data) {
    var role = data.role, exclude = data.exclude;
    var getRole = role;
    var removeDuplicatePermissions = [];
    var routers = (0, routerExpress_1.default)(request);
    getRole.permissions = role.permissions ? JSON.parse(role.permissions) : [];
    var rolePermission = (0, permissionsForeach_1.default)(getRole, routers, removeDuplicatePermissions, exclude);
    var filterRolesPermissions = rolePermission.permissions.map(function (item) {
        var findPermission = getRole.permissions.find(function (p) { return p.name === item.name; });
        return __assign(__assign({}, item), { permissions: (findPermission === null || findPermission === void 0 ? void 0 : findPermission.permissions) || item.permissions });
    });
    return __assign(__assign({}, getRole), { permissions: filterRolesPermissions });
};
exports.Permission = Permission;
