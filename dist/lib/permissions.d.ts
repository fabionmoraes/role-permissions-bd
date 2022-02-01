import { Request } from "express";
import { IProps } from "../type";
interface IPermissions extends IProps {
    roles: any[];
}
interface IPermission extends IProps {
    role: any;
}
export declare const Permissions: (request: Request, data: IPermissions) => any[];
export declare const Permission: (request: Request, data: IPermission) => any;
export {};
