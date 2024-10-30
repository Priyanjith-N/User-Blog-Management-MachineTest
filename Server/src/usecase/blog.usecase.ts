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
import IBlog, { IBlogCredentials } from "../entity/IBlog.entity";
import IBlogUseCase from "../interface/usecase/IBlog.usecase.interface";
import { isObjectIdOrHexString } from "mongoose";
import IBlogRepository from "../interface/repositories/IBlog.repository.interface";

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

            const newBlogData: Omit<IBlog, "_id"> = {
                title: blogCredentials.title,
                category: blogCredentials.category,
                content: blogCredentials.content,
                image: {
                    key: blogCredentials.image.key,
                    url: blogCredentials.image.location
                },
                tags: blogCredentials.tags || [],
                authorId: userId,
                createdAt: new Date(Date.now())
            }

            await this.blogRepository.createBlog(newBlogData); // save new blog
        } catch (err: any) {
            throw err;
        }
    }
}