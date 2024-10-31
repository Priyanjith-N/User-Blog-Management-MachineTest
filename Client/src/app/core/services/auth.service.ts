import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment'; // acessing environment variables

// constants
import { AuthAPIEndPoint } from '../constants/authAPIEndPoint';

// interfaces
import { IUserLoginCredentials, IUserRegisterationCredentials } from '../../shared/models/IAuthCredentials';
import { IIsUserAuthenticatedSucessfullAPIResponse, ILoginSucessfullAPIResponse, ILogoutSucessfullAPIResponse, IRegisterSucessfullAPIResponse } from '../../shared/models/IAuthAPISucessResponse';

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

  handelRegister(registerCredentials: IUserRegisterationCredentials): Observable<IRegisterSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${AuthAPIEndPoint.REGISTER_API}`;

    const registerApiResponse$: Observable<IRegisterSucessfullAPIResponse> = this.httpClient.post<IRegisterSucessfullAPIResponse>(api, registerCredentials);

    return registerApiResponse$;
  }

  isUserAuthenticated(): Observable<IIsUserAuthenticatedSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${AuthAPIEndPoint.IS_USER_AUTHENTICATED}`;

    const isUserAuthenticatedAPIResponse$: Observable<IIsUserAuthenticatedSucessfullAPIResponse> = this.httpClient.post<IIsUserAuthenticatedSucessfullAPIResponse>(api, {});

    return isUserAuthenticatedAPIResponse$;
  }

  handelLogout(): Observable<ILogoutSucessfullAPIResponse> {
    const api: string = `${this.backendDomain}${AuthAPIEndPoint.LOGOUT_API}`;

    const logoutApiResponse$: Observable<ILogoutSucessfullAPIResponse> = this.httpClient.post<ILogoutSucessfullAPIResponse>(api, {});

    return logoutApiResponse$;
  }
}
