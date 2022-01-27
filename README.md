# role-permissions-bd - Backend

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

## Usage

Ainda Criando conteúdo

```ts
Ainda criando...
```

## Utilização da Library NestJS

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
import { NextPermission } from "role-permissions-bd";

@Injectable()
export class PermissionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const user: any = request.user; // Na documentação do auth NestJS ele armazena o user no request

    const passed = NextPermission({
      request,
      userRoles: user.roles, // Aqui pega a roles do usuário user_roles
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
import { Request } from 'express'
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
    findAllRoutes(@Request() req: Request) {
        const role = await this.rolesService.findOne(...)
        return Permissions(req, { role, exclude: ['roles'] }) //exclude retira a rota roles para visualizar não sendo obrigatório
    }

    @Get('/routes')
    findAllRoutes(@Request() req: Request) {
        return AllRouters(req) // Aqui Retorna todas rotas como tudo false do exemplo acima
    }
}
```

## Utilização da Library NodeJS

-Criando Conteúdo
