import { Component, inject } from '@angular/core';

// componets
import { BlogCardComponent } from '../blog-card/blog-card.component';

// services
import { BlogService } from '../../../core/services/blog.service';

// interfaces
import { IGetAllBlogsOfCurrentUserSucessfullAPIResponse } from '../../models/IBlogAPISucessResponse';
import { IBlogWithUserDetails } from '../../models/IBlog.entity';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-blogs',
  standalone: true,
  imports: [
    BlogCardComponent
  ],
  templateUrl: './my-blogs.component.html',
  styleUrl: './my-blogs.component.css'
})
export class MyBlogsComponent {
  private blogService: BlogService = inject(BlogService);

  private blogData: IBlogWithUserDetails[] = [];
  displayBlogData: IBlogWithUserDetails[] = [];

  constructor() {
    this.getData();
  }

  private getData() {
    const getAllBlogsOfCurrentUserApiResponse$: Observable<IGetAllBlogsOfCurrentUserSucessfullAPIResponse> = this.blogService.getAllBlogsOfCurrentUser();

    getAllBlogsOfCurrentUserApiResponse$.subscribe({
      next: (res) => {
        this.blogData = res.data;
        this.displayBlogData = this.blogData;
      },
      error: (err) => {  }
    });
  }

  deleteBlog(blogId: string) {
    this.blogData = this.blogData.filter((blog) => blog._id !== blogId);

    this.displayBlogData = this.blogData;
  }
}
