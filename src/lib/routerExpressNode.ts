import { Request } from "express";

let storageRouter: any[] = [];

function getRoutes(stack: any) {
  const routes = (stack || [])
    .filter((it: any) => it.route || it.name === "router")
    .reduce((result: any, it: any) => {
      if (!it.route) {
        const stack = it.handle.stack;
        const routes = getRoutes(stack);

        const tt = {
          regexp: it.regexp,
          routes: routes,
        };

        storageRouter.push(tt);

        return result.concat(routes);
      }

      const methods = it.route.methods;

      const routes = { methods };

      return result.concat(routes);
    }, []);

  return routes;
}

export function nodeExpress(request: Request) {
  const entryPoint = request.app._router && request.app._router.stack;
  getRoutes(entryPoint);

  const alterPermissions: any[] = [];

  storageRouter
    .map((item) => ({
      name: String(item.regexp).split("/")[2].replace("\\", ""),
      permissions: item.routes,
    }))
    .filter((item) => !item.name.includes("?"))
    .forEach((item) => {
      item.permissions.forEach((p: any) => {
        Object.keys(p.methods).forEach((m) => {
          const methodToUpperCase = m.toUpperCase();
          const methodPatch =
            methodToUpperCase === "PATCH" ? "UPDATE" : methodToUpperCase;
          const method = methodPatch === "PUT" ? "UPDATE" : methodPatch;
          const result = { method, name: item.name };

          alterPermissions.push(result);
        });
      });
    });

  return alterPermissions;
}
