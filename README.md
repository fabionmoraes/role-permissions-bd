# role-permissions-bd - Backend

## express Compatibility

Role Permissions é testado e tem total compatibilidade com express 4x.

## O que a lib faz?

A Lib retorna de uma forma fácil as permissões de todas as rotas Express

## Para utilizar precisa?

- No banco de dados precisa ter as tabelas:
  --users[..info]
  --roles["name: string", "permissions: string"] // Aqui vai ser criado o perfil de permissão de acordo com a rota criada.
  --user_roles["user_id: string | number", "user_role_id: string | number"]

## Instalação

```bash
yarn add role-permissions-bd
# or
npm i role-permissions-bd --save
```

## Outra Library (Frontend) React JS

A Lib carrega os dados que vem do backend em um formato e mostra em tela para criar e editar.
Open [role-permissions-react](https://www.npmjs.com/package/role-permissions-react)

## Funcionalidades

### exclude

- O exclude vai retirar a rota que você deseja. Por ex.: ['users', 'roles'] O users e roles serão excluido

```ts
AllRouters(req, { exclude: ["users", "roles"] });
```

### exclude_prefix

- O exclude_prefix vai retirar o prefix da url que foi configurado ex.: http.../api { exclude_prefix: 'api } retira

```ts
AllRouters(req, { exclude_prefix: "api" });
```

## Utilização da Library NestJS

### Example Use Code

Open [Segue Exemplo do NestJS](https://github.com/fabionmoraes/use-role-permissions-bd-nestjs)

### Interceptors

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { NextPermission, UserRoles } from "role-permissions-bd";

@Injectable()
export class PermissionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const user: any = request.user; // Na documentação do auth NestJS ele armazena o user no request

    const passed = NextPermission({
      request,
      userRoles: UserRoles(user.user_roles), // Aqui pega a roles do usuário user_roles com relacionamento role
      roleNameNext: 'administrator', // Aqui você pode passar uma role name para passar. Por default o nome da role é admin
    });

    if (passed) {
      return next.handle();
    }

    throw new HttpException(...);
  }
}
```

### Controllers

```ts
...
import { AllRouters, Permissions, Permission } from 'role-permissions-bd'

@UseGuards(JwtAuthGuard) // Authenticação do proprio NestJS
@UseInterceptors(PermissionsInterceptor) // Utilização do Interceptors do NestJS
@Controllers('roles')
export class RolesController {
    constructor(...) {}

    @Get('/todo')
    async findAll() {
        const roles = await this.rolesService.findAll()
        return Permissions(req, { roles })

        // Retorno será uma junção das roles que já existe no seu banco com a permissão de cada rota
        // [
        //     {
        //         "id": 8,
        //         "name": "Suporte",
        //         "slug": "suporte",
        //         "permissions": [
        //             {
        //                 "name": "roles",
        //                 "permissions": {
        //                     "GET": true,// ... visualizar
        //                     "POST": true, // Usuário tem permissão de criar
        //                     "UPDATE": true, // ... alterar
        //                     "DELETE": false
        //                 }
        //             },
        //             {
        //                 "name": "countries",
        //                 "permissions": {
        //                     "GET": false
        //                 }
        //             },
        //         ],
        //         "created_at": "2022-01-27T19:32:23.855Z",
        //         "updated_at": "2022-01-27T19:32:23.855Z",
        //         "deleted_at": null
        //     }
        // ]
    }

    @Get('/one')
    findAllRoutes(@Request() req) {
        const role = await this.rolesService.findOne(...)
        return Permissions(req, { role, exclude: ['roles'] }) //exclude retira a rota roles para visualizar não sendo obrigatório
    }

    @Get('/routes')
    findAllRoutes(@Request() req) {
        return AllRouters(req) // Aqui Retorna todas rotas como tudo false do exemplo acima
    }
}
```

## Utilização da Library NodeJS

### Middleware

```ts
//src/middleware/handle
import { Request, Response, NextFunction } from "express";
import { container } from "tsyringe";
import { NextPermission } from "role-permissions-bd";

import { AppError } from "@config/AppError";
import { jwtVerify } from "@config/jwt";
import { FindOneUserByIdService } from "@modules/users/services/FindOneUserByIdService";

export default class RolePermissionsMiddleware {
  async handle(request: Request, response: Response, next: NextFunction) {
    const findOneUserByIdService = container.resolve(FindOneUserByIdService);

    const authToken = request.headers.authorization;

    const [, token] = authToken.split(" ");

    const { sub } = jwtVerify(token);

    const user = await findOneUserByIdService.execute(sub);

    const passed = NextPermission({
      request,
      userRoles: user.roles,
    });

    if (passed) {
      return next();
    }

    throw new AppError("Not Permission", 403);
  }
}

//src/middleware/index

import EnsureAuthenticated from "./handle/ensureAuthenticated";
import RolePermissions from "./handle/rolePermissions";

const ensureAuthenticated = new EnsureAuthenticated().handle;
const rolePermissionsMiddleware = new RolePermissions().handle;

export { rolePermissionsMiddleware, ensureAuthenticated };
```

### Controllers

```ts
import { Request, Response } from "express";

import { AllRouters, Permissions, Permission } from "role-permissions-bd";
import { container } from "tsyringe";

import { FindOneRoleByIdService } from "@modules/roles/services/FindOneRoleByIdService";
import { FindAllRoleService } from "@modules/roles/services/FindAllRoleService";

export class PermissionsController {
  async findAllRouters(request: Request, response: Response) {
    return response.json(
      AllRouters(request, { exclude: ["permissions", "auth"] })
    );
  }

  async findOneRole(request: Request, response: Response) {
    const { id } = request.params;

    try {
      const findOneRoleByIdService = container.resolve(FindOneRoleByIdService);
      const role = await findOneRoleByIdService.execute(+id);

      return response.json(Permission(request, { role }));
    } catch (err: any) {
      return response.sendError(err.message);
    }
  }

  async findAllTools(request: Request, response: Response) {
    const findAllRoleService = container.resolve(FindAllRoleService);

    try {
      const roles = await findAllRoleService.execute();

      return response.json(
        Permissions(request, { roles, exclude: ["permissions", "auth"] })
      );
    } catch (err: any) {
      return response.sendError(err.message);
    }
  }
}
```

### Routes

```ts
import { Router } from "express";
import { ensureAuthenticated } from "middleware";
import { PermissionsController } from "./PermissionsController";

const permissionsRoutes = Router();
const permissionsController = new PermissionsController();

// permissionsRoutes.use(ensureAuthenticated)

permissionsRoutes.get("/routes", permissionsController.findAllRouters);
permissionsRoutes.get("/roles", permissionsController.findAllTools);
permissionsRoutes.get("/roles/:id", permissionsController.findOneRole);

export { permissionsRoutes };
```
