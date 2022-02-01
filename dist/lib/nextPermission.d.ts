interface INextPermission {
    request: any;
    userRoles: any[];
}
export declare const NextPermission: ({ request, userRoles }: INextPermission) => true | undefined;
export {};
