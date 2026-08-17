import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred!';

      if (error.error && error.error.message) {
        if (Array.isArray(error.error.message)) {
          errorMessage = error.error.message.join('\n');
        } else {
          errorMessage = error.error.message;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      if (error.status === 401) {
        router.navigate(['/login']);
      }
      alert(`Error (${error.status}):\n${errorMessage}`);

      return throwError(() => error);
    })
  );
};
