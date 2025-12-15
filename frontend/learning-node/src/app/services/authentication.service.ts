import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient)
  {}

  login(loginFormData: FormData): Observable<any>
  {
    return this._http.post('http://localhost:8000/api/auth/login', loginFormData);
  }

  register(registerData: any): Observable<any>
  {
    return this._http.post('http://localhost:8000/api/auth/register', registerData);
  }

  // isUserExist(userobj: Object): any
  // {
  // }
}
