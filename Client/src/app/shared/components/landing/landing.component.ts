import { Component } from '@angular/core';
import { BlogCardComponent } from '../blog-card/blog-card.component';

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

}
