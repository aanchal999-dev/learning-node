import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient)
  {}

  login(loginFormData: any): Observable<any>
  {
    return this._http.post('http://localhost:8000/api/auth/login', loginFormData);
  }

  register(registerData: any): Observable<any>
  {
    return this._http.post('http://localhost:8000/api/auth/register', registerData);
  }

  saveToken(data: any): void
  {
    localStorage.setItem('access_token', data.token);
    localStorage.setItem('role', data.role);

  }

  getUser(): Observable<any>
  {
    return this._http.get('http://localhost:8000/api/auth/getUser')
  }
}
