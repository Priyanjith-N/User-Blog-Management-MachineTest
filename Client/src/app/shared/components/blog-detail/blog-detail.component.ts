import { Component, inject } from '@angular/core';
import { BlogService } from '../../../core/services/blog.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IGetAllBlogDetailsSucessfullAPIResponse } from '../../models/IBlogAPISucessResponse';
import { Observable } from 'rxjs';
import { IBlogWithUserDetails } from '../../models/IBlog.entity';
import { DateFormaterPipe } from '../../pipe/date-formater.pipe';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    DateFormaterPipe
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css'
})
export class BlogDetailComponent {
  private blogService: BlogService = inject(BlogService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  private blogId: string | null = null;
  blogData: IBlogWithUserDetails | null = null;

  constructor() {
    this.blogId = this.activatedRoute.snapshot.paramMap.get("blogId");

    this.getData();
  }

  private getData() {
    if(!this.blogId) {
      this.router.navigate(["/"]);
      return;
    }

    const getBlogDetailApiResponse$: Observable<IGetAllBlogDetailsSucessfullAPIResponse> = this.blogService.getBlogDetailsById(this.blogId);

    getBlogDetailApiResponse$.subscribe({
      next: (res) => {
        this.blogData = res.data;
      },
      error: (err) => {  }
    });
  }
}
