import { Request } from "express";
import { nodeExpress } from "./routerExpressNode";

export default function routerExpress(request: Request, prefix?: string) {
  const routes = request.app._router.stack;
  const routers = routes
    .map((layer: any) => {
      if (layer.route) {
        const path = layer.route?.path;
        const method = layer.route?.stack[0].method;
        const methodPatch = method === "patch" ? "update" : method;
        const alterMethod = methodPatch === "put" ? "update" : methodPatch;

        let alterPath = "";

        if (prefix) {
          alterPath = path.includes(prefix)
            ? path.replace(`/${prefix}`, "")
            : "";
        }

        if (!path.includes("auth") && !path.includes("me")) {
          const pathSplit = alterPath
            ? alterPath.split("/")[1]
            : path.split("/")[1];

          return {
            method: alterMethod.toUpperCase(),
            name: pathSplit,
          };
        }
      }
    })
    .filter((item: any) => item !== undefined)
    .filter((item: any) => item?.name !== undefined);

  if (routers.length === 0) {
    return nodeExpress(request);
  }

  if (prefix) {
    return routers.filter((r: any) => !r.name.includes(prefix));
  }

  return routers;
}
