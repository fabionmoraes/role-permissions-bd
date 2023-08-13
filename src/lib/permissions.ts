import { Request } from "express";
import routerExpress from "./routerExpress";
import permissionsForeach from "./permissionsForeach";
import { IProps } from "../type";

interface IPermissions extends IProps {
  roles: any[];
  role_name?: string;
}

interface IPermission extends IProps {
  role: any;
}

export const Permissions = (request: Request, data: IPermissions) => {
  const { roles, exclude, role_name } = data;
  const prefix = data?.exclude_prefix || "";
  const permissionSlug = role_name || "admin";

  const rolesFilter = roles.filter((item) => item.slug !== permissionSlug);

  const removeDuplicatePermissions: any[] = [];

  const routers = routerExpress(request, prefix);

  const rolesMap = rolesFilter.map((item) => ({
    ...item,
    permissions: item.permissions ? JSON.parse(item.permissions) : [],
  }));

  const roleAlter = rolesMap.map((role) => {
    return permissionsForeach(
      role,
      routers,
      removeDuplicatePermissions,
      exclude
    );
  });

  // Percorrer a roles do banco para puxar as permissões
  return roleAlter.map((item) => ({
    ...item,
    permissions: item.permissions.map((p: any) => {
      const getRoles = roles.find((r) => r.slug === item.slug);
      const getPermissions = getRoles.permissions
        ? JSON.parse(getRoles.permissions)
        : [];
      const permission = getPermissions.find((pp: any) => pp.name === p.name);

      return {
        ...p,
        permissions: permission?.permissions || p.permissions,
      };
    }),
  }));
};

export const Permission = (request: Request, data: IPermission) => {
  const { role, exclude } = data;
  const prefix = data?.exclude_prefix || "";

  const getRole = role;
  const removeDuplicatePermissions: any[] = [];

  const routers = routerExpress(request, prefix);

  getRole.permissions = role.permissions ? JSON.parse(role.permissions) : [];

  const rolePermission = permissionsForeach(
    getRole,
    routers,
    removeDuplicatePermissions,
    exclude
  );

  const filterRolesPermissions = rolePermission.permissions.map((item: any) => {
    const findPermission = getRole.permissions.find(
      (p: any) => p.name === item.name
    );

    return {
      ...item,
      permissions: findPermission?.permissions || item.permissions,
    };
  });

  return { ...getRole, permissions: filterRolesPermissions };
};
