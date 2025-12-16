import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CdkOverlayOrigin } from "@angular/cdk/overlay";
import { AuthenticationService } from '../services/authentication.service';
import { take } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  providers:[AuthenticationService],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  registerForm = new FormGroup({
    name: new FormControl('aanchal', [Validators.required]),
    designation: new FormControl('SDE', [Validators.required]),
    username: new FormControl('au@gm.com', [Validators.required, Validators.email]),
    password: new FormControl('qwertyui', [Validators.required, Validators.minLength(6)])
  });
  serverError: string;


  constructor( private _authenticationService: AuthenticationService,
                private _router: Router
  )
  {
    this.serverError = '';
  }

  ngOnInit(): void
  {}

  onSubmit(): void
  {
    if(this.registerForm.valid)
      {
        this.serverError = '';
        const registerFormData: FormData = new FormData();
        // registerFormData.append('name', this.registerForm.controls.name.value || '');
        // registerFormData.append('designation', this.registerForm.controls.designation.value || '');
        // registerFormData.append('username', this.registerForm.controls.username.value || '');
        // registerFormData.append('password', this.registerForm.controls.password.value || '');

        const obj = {'name': this.registerForm.controls.name.value || '' ,
        'designation': this.registerForm.controls.designation.value || '' ,
        'username': this.registerForm.controls.username.value || '' ,
        'password': this.registerForm.controls.password.value || '' ,
        }

        this._authenticationService.register(obj)
        .pipe(
          take(1)
        )
        .subscribe((data: any) => {
          this._router.navigate(['login']);
        });
      }
  }
}
