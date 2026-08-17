import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export function tokenInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>>
{
  if (request.url.indexOf('login') === -1 && request.url.indexOf('register') === -1)
    {
      const token = localStorage.getItem('access_token');
      const newReq = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next(newReq);
    }
  return next(request);
}
