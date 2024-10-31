import { NextFunction, Response } from "express";

// constants
import { ResponseMessage } from "../../constants/sucessMessage";

// enums
import { StatusCodes } from "../../enums/statusCode.enum";

// interfaces
import IAuthRequest from "../../interface/common/IAuthRequest.interface";
import IBlogController from "../../interface/controllers/IBlog.controller.interface";
import IBlog, { IBlogCredentials, IBlogWithUserDetails } from "../../entity/IBlog.entity";
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

    async getBlogData(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IBlog = await this.blogUseCase.getBlogData(req.params.blogId, req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL,
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async editBlog(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const editBlogCredentials: IBlogCredentials = {
                title: req.body.title,
                category: req.body.category,
                content: req.body.content,
                image: req.file as Express.MulterS3.File,
                tags: req.body.tags,
            }
            
            await this.blogUseCase.handelEditBlog(editBlogCredentials, req.params.blogId, req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL
            });
        } catch (err: any) {
            next(err);
        }
    }

    async deleteBlog(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.blogUseCase.deleteBlog(req.params.blogId, req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllBlogs(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IBlogWithUserDetails[] = await this.blogUseCase.getAllBolgs();

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL,
                data
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getAllBlogsOfCurrentUser(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: IBlogWithUserDetails[] = await this.blogUseCase.getAllBolgsOfCurrentUser(req.id);

            res.status(StatusCodes.Success).json({
                message: ResponseMessage.SUCESSFULL,
                data
            });
        } catch (err: any) {
            next(err);
        }
    }
}