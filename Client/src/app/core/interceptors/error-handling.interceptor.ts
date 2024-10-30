import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

// error interface
import { IValidationError } from '../../shared/models/IAPIError';

// constants
import { AuthAPIEndPoint } from '../constants/authAPIEndPoint';
import { ErrorType } from '../constants/errorType';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const avoidRoute: string = `/${req.url.split('/').slice(-2).join("/")}`;

  if(avoidRoute === AuthAPIEndPoint.IS_USER_AUTHENTICATED) {
    return next(req);
  }
  
  const router: Router = inject(Router);

  return next(req).pipe(
    catchError((err: any) => {
      if(!err.error) return throwError(() => err);

      const errObj: any = err.error;

      console.error(errObj.errorCode);
      
      if(errObj.errorField) {
        return throwError(() => errObj as IValidationError);
      }else if(errObj.type === ErrorType.TOKEN) {
        router.navigate(["/auth/login"]); // user is not authenticated
      }

      return throwError(() => err.error);
    })
  );
};
