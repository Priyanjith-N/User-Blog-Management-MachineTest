import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '../../../environments/environment'; // acessing environment variables

// constants
import { AuthAPIEndPoint } from '../constants/authAPIEndPoint';

// interfaces
import { IUserLoginCredentials } from '../../shared/models/IAuthCredentials';
import { ILoginSucessfullAPIResponse } from '../../shared/models/IAuthAPISucessResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient: HttpClient = inject(HttpClient);

  private backendDomain: string = environment.BACKEND_DOMAIN;

  handelLogin(loginCredentials: IUserLoginCredentials): Observable<ILoginSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${AuthAPIEndPoint.LOGIN_API}`;

    const loginAPIResponse$: Observable<ILoginSucessfullAPIResponse> = this.httpClient.post<ILoginSucessfullAPIResponse>(api, loginCredentials);

    return loginAPIResponse$;
  }
}
