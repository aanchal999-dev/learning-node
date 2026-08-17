import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private _http: HttpClient) { }

  login(loginFormData: any): Observable<any> {
    return this._http.post('http://localhost:8080/api/auth/login', loginFormData);
  }

  register(registerData: any): Observable<any> {
    return this._http.post('http://localhost:8080/api/auth/register', registerData);
  }

  saveToken(data: any): void {
    localStorage.setItem('access_token', data.token);
    localStorage.setItem('role', data.role);

  }

  getUser(): Observable<any> {
    return this._http.get('http://localhost:8080/api/users')
  }

  deleteUser(userId: number): Observable<any> {
    return this._http.delete(`http://localhost:8080/api/users/${userId}`);
  }

  updateUserRole(userId: string): Observable<any> {
    return this._http.patch(`http://localhost:8080/api/users/updateRole`, { userId });
  }
}
