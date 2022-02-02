interface INextPermission {
  request: any;
  userRoles: any[];
}

export const NextPermission = ({ request, userRoles }: INextPermission) => {
  const pathname = request.originalUrl;

  const roleNames = userRoles.map((item: any) => item.slug);

  if (roleNames.includes("admin")) {
    return true;
  }

  const userPermissions = userRoles.map((role: any) => role.permissions);
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
