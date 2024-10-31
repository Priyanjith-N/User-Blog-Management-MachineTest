// errors
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import ValidationError from "../errors/validationErrorDetails.error";

// constants
import { ErrorMessage } from "../constants/errorMesaage";
import { ErrorCode } from "../constants/customStatusErrorCode";
import { ErrorField } from "../constants/errorField";

// enums
import { StatusCodes } from "../enums/statusCode.enum";

// interfaces
import IBlog, { IBlogCredentials, IBlogWithUserDetails } from "../entity/IBlog.entity";
import IBlogUseCase from "../interface/usecase/IBlog.usecase.interface";
import { isObjectIdOrHexString } from "mongoose";
import IBlogRepository from "../interface/repositories/IBlog.repository.interface";
import { deleteImageFromS3 } from "../interface/utils/s3ConfigurationAndMulterSetup.utils";

export default class BlogUseCase implements IBlogUseCase {
    private blogRepository: IBlogRepository;

    constructor(blogRepository: IBlogRepository) {
        this.blogRepository = blogRepository;
    }

    async handelCreateNewBlog(blogCredentials: IBlogCredentials, userId: string | undefined): Promise<void | never> {
        try {
            if(!blogCredentials.title || !blogCredentials.category || !blogCredentials.content || !blogCredentials.image || !userId || !isObjectIdOrHexString(userId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            if(blogCredentials.title.length < 5) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.TITLE, message: ErrorMessage.MIN_TITLE_LENGTH_NOT_MEET, errorCode: ErrorCode.MIN_TITLE_NOT_MEET });
            }else if(blogCredentials.content.length < 50) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.CONTENT, message: ErrorMessage.MIN_CONTENT_LENGTH_NOT_MEET, errorCode: ErrorCode.MIN_CONTENT_NOT_MEET });
            }

            if(!blogCredentials.tags || typeof blogCredentials.tags === "string") {
                blogCredentials.tags = JSON.parse(blogCredentials.tags || "[]");
            }

            const newBlogData: Omit<IBlog, "_id"> = {
                title: blogCredentials.title,
                category: blogCredentials.category,
                content: blogCredentials.content,
                image: {
                    key: blogCredentials.image.key,
                    url: blogCredentials.image.location
                },
                tags: blogCredentials.tags as string[],
                authorId: userId,
                createdAt: new Date(Date.now())
            }

            await this.blogRepository.createBlog(newBlogData); // save new blog
        } catch (err: any) {
            throw err;
        }
    }

    async getBlogData(blogId: string | undefined, userId: string | undefined): Promise<IBlog | never> {
        try {
            if(!blogId || !isObjectIdOrHexString(blogId) || !userId || !isObjectIdOrHexString(userId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            const blogData: IBlog | null = await this.blogRepository.getBlogDataByIdAndUserId(blogId, userId);

            if(!blogData) throw new RequiredCredentialsNotGiven(ErrorMessage.INVAILD_OR_NOT_AUTHER_OF_BLOG, ErrorCode.INVAILD_AUTHOR_OR_NOT_THE_OWNER_OF_BLOG);

            return blogData;
        } catch (err: any) {
            throw err;
        }
    }

    async handelEditBlog(blogCredentials: IBlogCredentials, blogId: string | undefined, userId: string | undefined): Promise<void | never> {
        try {
            if(!blogCredentials.title || !blogCredentials.category || !blogCredentials.content || !blogCredentials.image || !userId || !isObjectIdOrHexString(userId) || !blogId || !isObjectIdOrHexString(blogId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            if(blogCredentials.title.length < 5) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.TITLE, message: ErrorMessage.MIN_TITLE_LENGTH_NOT_MEET, errorCode: ErrorCode.MIN_TITLE_NOT_MEET });
            }else if(blogCredentials.content.length < 50) {
                throw new ValidationError({ statusCode: StatusCodes.BadRequest, errorField: ErrorField.CONTENT, message: ErrorMessage.MIN_CONTENT_LENGTH_NOT_MEET, errorCode: ErrorCode.MIN_CONTENT_NOT_MEET });
            }

            if(!blogCredentials.tags || typeof blogCredentials.tags === "string") {
                blogCredentials.tags = JSON.parse(blogCredentials.tags || "[]");
            }

            const blogData: IBlog | null = await this.blogRepository.getBlogDataByIdAndUserId(blogId, userId);

            if(!blogData) {
                await deleteImageFromS3(blogCredentials.image.key); // delete newly uploaded image

                throw new RequiredCredentialsNotGiven(ErrorMessage.INVAILD_OR_NOT_AUTHER_OF_BLOG, ErrorCode.INVAILD_AUTHOR_OR_NOT_THE_OWNER_OF_BLOG);
            }

            const newBlogData: Omit<IBlog, "_id"> = {
                title: blogCredentials.title,
                category: blogCredentials.category,
                content: blogCredentials.content,
                image: {
                    key: blogCredentials.image.key,
                    url: blogCredentials.image.location
                },
                tags: blogCredentials.tags as string[],
                authorId: userId,
                createdAt: new Date(blogData.createdAt)
            }

            await this.blogRepository.updateBlogData(newBlogData, userId, blogId); // update the blog with new data

            await deleteImageFromS3(blogData.image.key); // delete newly uploaded image
        } catch (err: any) {
            throw err;
        }
    }

    async deleteBlog(blogId: string | undefined, userId: string | undefined): Promise<void | never> {
        try {
            if(!blogId || !isObjectIdOrHexString(blogId) || !userId || !isObjectIdOrHexString(userId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            const blogData: IBlog | null = await this.blogRepository.getBlogDataByIdAndUserId(blogId, userId);

            if(!blogData) throw new RequiredCredentialsNotGiven(ErrorMessage.INVAILD_OR_NOT_AUTHER_OF_BLOG, ErrorCode.INVAILD_AUTHOR_OR_NOT_THE_OWNER_OF_BLOG);

            await this.blogRepository.deleteBlog(blogId, userId); // delete the blog

            await deleteImageFromS3(blogData.image.key); // delete the image of that blog
        } catch (err: any) {
            throw err;
        }
    }

    async getAllBolgs(): Promise<IBlogWithUserDetails[] | never> {
        try {
            return await this.blogRepository.getAllBlogs();
        } catch (err: any) {
            throw err;
        }
    }

    async getAllBolgsOfCurrentUser(userId: string | undefined): Promise<IBlogWithUserDetails[] | never> {
        try {
            if(!userId || !isObjectIdOrHexString(userId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            return await this.blogRepository.getBlogsOfCurrentUser(userId);
        } catch (err: any) {
            throw err;
        }
    }

    async getBlogDetialsById(blogId: string | undefined): Promise<IBlogWithUserDetails | never> {
        try {
            if(!blogId || !isObjectIdOrHexString(blogId)) throw new RequiredCredentialsNotGiven(ErrorMessage.REQUIRED_CREDENTIALS_NOT_GIVEN, ErrorCode.CREDENTIALS_NOT_GIVEN_OR_NOT_FOUND);

            return await this.blogRepository.getBlogWithUserDetailsById(blogId);
        } catch (err: any) {
            throw err;
        }
    }
}