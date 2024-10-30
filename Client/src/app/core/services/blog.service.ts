import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// constants
import { BlogAPIEndPoint } from '../constants/blogAPIEndPoint';

// interfaces
import { IBlogCredentials } from '../../shared/models/IBlog.entity';
import { ICreateBlogSucessfullAPIResponse } from '../../shared/models/IBlogAPISucessResponse';


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
}
