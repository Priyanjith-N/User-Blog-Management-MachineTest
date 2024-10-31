import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

// componets
import { BlogCardComponent } from '../blog-card/blog-card.component';

// services
import { BlogService } from '../../../core/services/blog.service';

// interfaces
import { IGetAllBlogsSucessfullAPIResponse } from '../../models/IBlogAPISucessResponse';
import { IBlogWithUserDetails } from '../../models/IBlog.entity';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    BlogCardComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private blogService: BlogService = inject(BlogService);

  private blogData: IBlogWithUserDetails[] = [];
  displayBlogData: IBlogWithUserDetails[] = [];

  constructor() {
    this.getData();
  }

  private getData() {
    const getAllBlogsApiResponse$: Observable<IGetAllBlogsSucessfullAPIResponse> = this.blogService.getAllBlogs();

    getAllBlogsApiResponse$.subscribe({
      next: (res) => {
        this.blogData = res.data;
        this.displayBlogData = this.blogData;
      },
      error: (err) => {  }
    });
  }
}
