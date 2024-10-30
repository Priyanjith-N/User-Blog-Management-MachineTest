import { NextFunction, Response } from "express";

// constants
import { ResponseMessage } from "../../constants/sucessMessage";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

// interfaces
import IAuthRequest from "../../interface/common/IAuthRequest.interface";
import IBlogController from "../../interface/controllers/IBlog.controller.interface";
import { IBlogCredentials } from "../../entity/IBlog.entity";
import IBlogUseCase from "../../interface/usecase/IBlog.usecase.interface";

export default class BlogController implements IBlogController {
    private blogUseCase: IBlogUseCase;

    constructor(blogUseCase: IBlogUseCase) {
        this.blogUseCase = blogUseCase;
    }

    async createBlog(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const addBlogCredentials: IBlogCredentials = {
                title: req.body.title,
                category: req.body.category,
                content: req.body.content,
                image: req.file as Express.MulterS3.File,
                tags: req.body.tags,
            }

            await this.blogUseCase.handelCreateNewBlog(addBlogCredentials, req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL
            });
        } catch (err: any) {
            next(err);
        }
    }
}