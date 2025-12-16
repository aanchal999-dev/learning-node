import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../services/authentication.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  providers:[AuthenticationService],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent  implements OnInit{
  loginForm = new FormGroup({
    username: new FormControl('au@gm.com', [Validators.required, Validators.email]),
    password: new FormControl('qwertyui', [Validators.required, Validators.minLength(6)])
  });
  serverError: string;

  constructor( private _authenticationService: AuthenticationService)
  {
    this.serverError = '';
  }

  ngOnInit(): void
  {}

  onSubmit(): void
  {
    if(this.loginForm.valid)
      {
        this.serverError = '';
        const loginFormData: FormData = new FormData();
        // loginFormData.append('username', this.loginForm.controls.username.value || '');
        // loginFormData.append('password', this.loginForm.controls.password.value || '');
        const obj = {
          'username': this.loginForm.controls.username.value || '' ,
          'password': this.loginForm.controls.password.value || ''
        }

        this._authenticationService.login(obj)
        .pipe(
          take(1)
        )
        .subscribe((data: any) =>
          {
            this._authenticationService.saveToken(data.token);
            this._authenticationService.getUser().subscribe();
          }

        )
      }
  }
}
