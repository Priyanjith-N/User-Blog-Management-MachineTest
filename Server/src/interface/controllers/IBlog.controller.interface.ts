import { NextFunction, Response } from "express";

// interfaces
import IAuthRequest from "../common/IAuthRequest.interface";

export default interface IBlogController {
    createBlog(req: IAuthRequest, res: Response, next: NextFunction): Promise<void>;
}