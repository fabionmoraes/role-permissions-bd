export default function permissionsForeach(
  role: any,
  routers: any,
  removeDuplicatePermissions: any[],
  exclude?: string[]
) {
  const permissions: any[] = [];

  role.permissions.forEach((elem: any) => {
    const filterRemoveRouters = routers.filter(
      (item: any) => !item.name.includes(elem.name)
    );

    permissions.push(elem);

    const methods: any[] = [];

    filterRemoveRouters.forEach((r: any) => {
      if (methods.length) {
        const methodFindIndex = methods.findIndex(
          (item) => item.name === r.name
        );

        if (methods[methodFindIndex]) {
          methods[methodFindIndex] = {
            name: methods[methodFindIndex].name,
            permissions: {
              ...methods[methodFindIndex].permissions,
              [r.method]: false,
            },
          };
        }
      }

      methods.push({
        name: r.name,
        permissions: {
          [r.method]: false,
        },
      });

      const findM = methods.findIndex((item) => item.name === r.name);

      permissions.push(methods[findM]);
    });
  });

  permissions.map((p) => {
    const getP = removeDuplicatePermissions.find((i) => i.name === p.name);
    if (getP) {
      const getF = removeDuplicatePermissions.findIndex(
        (i) => i.name === getP.name
      );

      removeDuplicatePermissions[getF] = p;
    } else {
      removeDuplicatePermissions.push(p);
    }
  });

  if (exclude) {
    exclude.forEach((item) => {
      const index = removeDuplicatePermissions.findIndex(
        (i) => i.name === item
      );

      if (index !== -1) removeDuplicatePermissions.splice(index, 1);
    });
  }

  return { ...role, permissions: removeDuplicatePermissions };
}
