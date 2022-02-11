interface INextPermission {
    request: any;
    userRoles: any[];
    roleNameNext?: string;
}
export declare const NextPermission: ({ request, userRoles, roleNameNext, }: INextPermission) => true | undefined;
export {};
