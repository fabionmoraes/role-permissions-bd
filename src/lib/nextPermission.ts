interface INextPermission {
  request: any;
  userRoles: any[];
  roleNameNext?: string;
}

export const NextPermission = ({
  request,
  userRoles,
  roleNameNext = "admin",
}: INextPermission) => {
  const pathname = request.originalUrl;

  const roleNames = userRoles.map((item: any) => item.slug);

  if (roleNames.includes(roleNameNext)) {
    return true;
  }

  const userPermissions: any = userRoles.map((role: any) => {
    if (typeof role.permissions === "string") {
      return JSON.parse(role.permissions);
    }

    return role.permissions || [];
  });

  const permission = userPermissions
    .flat()
    .find((item: any) => pathname.includes(item.name));

  if (
    permission &&
    Object.keys(permission).length &&
    permission.permissions[request.method] === true
  ) {
    return true;
  }
};
