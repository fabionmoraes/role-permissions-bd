import { Router } from "express";

export default function routerExpress(router: Router) {
  return router.stack
    .map((layer) => {
      if (layer.route) {
        const path = layer.route?.path;
        const method = layer.route?.stack[0].method;
        const alterMethod = method === "patch" ? "update" : method;

        if (!path.includes("auth") && !path.includes("me")) {
          return {
            method: alterMethod.toUpperCase(),
            name: path.split("/")[2],
          };
        }
      }
    })
    .filter((item) => item !== undefined)
    .filter((item) => item?.name !== undefined);
}
