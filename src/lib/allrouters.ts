import { Request } from "express";
import routerExpress from "./routerExpress";
import { IProps } from "../type";

export interface AllRoutersProps {
  name: string;
  permissions: any;
}

export function AllRouters(request: Request, data?: IProps): AllRoutersProps[] {
  const permissions: any[] = [];
  const removeDuplicate: any[] = [];
  const methods: any[] = [];
  const routers = routerExpress(request.app._router);

  routers.forEach((r: any) => {
    if (methods.length) {
      const methodFindIndex = methods.findIndex((item) => item.name === r.name);

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

  permissions.map((p) => {
    const getP = removeDuplicate.find((i) => i.name === p.name);
    if (getP) {
      const getF = removeDuplicate.findIndex((i) => i.name === getP.name);

      removeDuplicate[getF] = p;
    } else {
      removeDuplicate.push(p);
    }
  });

  if (data) {
    const { exclude } = data;

    if (exclude) {
      exclude.forEach((item) => {
        const index = removeDuplicate.findIndex((i) => i.name === item);

        if (index !== -1) removeDuplicate.splice(index, 1);
      });
    }
  }

  return removeDuplicate as AllRoutersProps[];
}
