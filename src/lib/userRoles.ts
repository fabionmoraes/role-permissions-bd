export function UserRoles(userRoles: any) {
  const roles = userRoles.map((role: any) => role.role);

  return roles.map((role: any) => {
    role["permissions"] = role.permissions ? JSON.parse(role.permissions) : [];
    return role;
  });
}
