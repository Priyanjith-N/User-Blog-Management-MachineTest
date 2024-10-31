import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// constants
import { BlogAPIEndPoint } from '../constants/blogAPIEndPoint';

// interfaces
import { ICreateBlogSucessfullAPIResponse, IGetBlogDataByIdSucessfullAPIResponse } from '../../shared/models/IBlogAPISucessResponse';


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
}
