import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ILogoutSucessfullAPIResponse } from '../../../shared/models/IAuthAPISucessResponse';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  logOut() {
    const logoutApiResponse$: Observable<ILogoutSucessfullAPIResponse> = this.authService.handelLogout();

    logoutApiResponse$.subscribe({
      next: (res) => {
        this.router.navigate(["/auth/login"]);
      },
      error: (err) => {  }
    });
  }
}
