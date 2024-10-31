import { Component, Input } from '@angular/core';

// interfaces
import { IBlogWithUserDetails } from '../../models/IBlog.entity';
import { DateFormaterPipe } from '../../pipe/date-formater.pipe';
import { RouterLink } from '@angular/router';

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
}
