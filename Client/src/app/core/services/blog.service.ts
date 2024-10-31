import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// constants
import { BlogAPIEndPoint } from '../constants/blogAPIEndPoint';

// interfaces
import { ICreateBlogSucessfullAPIResponse, IDeleteBlogSucessfullAPIResponse, IEditBlogSucessfullAPIResponse, IGetAllBlogsSucessfullAPIResponse, IGetBlogDataByIdSucessfullAPIResponse } from '../../shared/models/IBlogAPISucessResponse';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private httpClient: HttpClient = inject(HttpClient);

  private backendDomain: string = environment.BACKEND_DOMAIN;

  createBlog(blogCredentials: FormData): Observable<ICreateBlogSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${BlogAPIEndPoint.CREATE_BLOG}`;

    const createBlogApiResponse$: Observable<ICreateBlogSucessfullAPIResponse> = this.httpClient.post<ICreateBlogSucessfullAPIResponse>(api, blogCredentials);

    return createBlogApiResponse$;
  }

  getBlogById(blogId: string): Observable<IGetBlogDataByIdSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${BlogAPIEndPoint.GET_BLOG_BY_ID}${blogId}`;

    const getBlogDataByIdApiResponse$: Observable<IGetBlogDataByIdSucessfullAPIResponse> = this.httpClient.get<IGetBlogDataByIdSucessfullAPIResponse>(api);

    return getBlogDataByIdApiResponse$;
  }

  editBlog(blogCredentials: FormData, blogId: string): Observable<IEditBlogSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${BlogAPIEndPoint.EDIT_BLOG}${blogId}`;

    const editBlogApiResponse$: Observable<IEditBlogSucessfullAPIResponse> = this.httpClient.put<IEditBlogSucessfullAPIResponse>(api, blogCredentials);

    return editBlogApiResponse$;
  }

  deleteBlogById(blogId: string): Observable<IDeleteBlogSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${BlogAPIEndPoint.DELETE_BLOG}${blogId}`;

    const deleteBlogByIdApiResponse$: Observable<IDeleteBlogSucessfullAPIResponse> = this.httpClient.delete<IDeleteBlogSucessfullAPIResponse>(api);

    return deleteBlogByIdApiResponse$;
  }

  getAllBlogs(): Observable<IGetAllBlogsSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${BlogAPIEndPoint.GET_ALL_BLOGS}`;

    const getAllBlogs$: Observable<IGetAllBlogsSucessfullAPIResponse> = this.httpClient.get<IGetAllBlogsSucessfullAPIResponse>(api);

    return getAllBlogs$;
  }
}
