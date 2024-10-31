// interfaces
import IBlog from "./IBlog.entity";

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