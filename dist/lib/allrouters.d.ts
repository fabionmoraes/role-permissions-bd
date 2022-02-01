import { Request } from "express";
import { IProps } from "../type";
export interface AllRoutersProps {
    name: string;
    permissions: any;
}
export declare function AllRouters(request: Request, data?: IProps): AllRoutersProps[];
