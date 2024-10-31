// interfaces
import IBlog, { IBlogWithUserDetails } from "./IBlog.entity";

export interface ICreateBlogSucessfullAPIResponse {
    message: string;
}

export interface IGetBlogDataByIdSucessfullAPIResponse {
    message: string;
    data: IBlog;
}

export interface IEditBlogSucessfullAPIResponse {
    message: string;
}

export interface IDeleteBlogSucessfullAPIResponse {
    message: string;
}

export interface IGetAllBlogsSucessfullAPIResponse {
    message: string;
    data: IBlogWithUserDetails[];
}

export interface IGetAllBlogsOfCurrentUserSucessfullAPIResponse extends IGetAllBlogsSucessfullAPIResponse { }

export interface IGetAllBlogDetailsSucessfullAPIResponse {
    message: string;
    data: IBlogWithUserDetails;
}