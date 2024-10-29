import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ILoginForm } from '../../../shared/models/IFormGroup';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  
}
