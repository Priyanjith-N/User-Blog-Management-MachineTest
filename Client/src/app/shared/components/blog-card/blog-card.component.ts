import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

// interfaces
import { IBlogWithUserDetails } from '../../models/IBlog.entity';
import { DateFormaterPipe } from '../../pipe/date-formater.pipe';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../../core/services/blog.service';
import { IDeleteBlogSucessfullAPIResponse } from '../../models/IBlogAPISucessResponse';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [
    DateFormaterPipe,
    RouterLink
  ],
  templateUrl: './blog-card.component.html',
  styleUrl: './blog-card.component.css'
})
export class BlogCardComponent {
  @Input({ required: true }) blog: IBlogWithUserDetails | undefined;
  @Input({ required: true }) isMyBlogComponent: boolean = false;

  @Output() blogDeletedSucessfully: EventEmitter<string> = new EventEmitter<string>;

  private blogService: BlogService = inject(BlogService);

  deleteBlog() {
    if(!this.blog) return;

    const deleteBlogByIdApiResponse$: Observable<IDeleteBlogSucessfullAPIResponse> = this.blogService.deleteBlogById(this.blog._id);

    deleteBlogByIdApiResponse$.subscribe({
      next: (res) => {
        this.blogDeletedSucessfully.emit(this.blog!._id);
      },
      error: (err) => {  }
    });
  }

  stopEventPropagation(event: Event) {
    event.stopPropagation();
  }
}
