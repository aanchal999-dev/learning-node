import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  userDataSource: MatTableDataSource<any>;
  userColumns: string[];
  selectedVideo: File | null;
  isAdmin: boolean = localStorage.getItem('role') === 'admin';

  constructor(private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router

  ) {
    this.userDataSource = new MatTableDataSource<any>();
    this.selectedVideo = null;
    this.userColumns = this.isAdmin ? ['name', 'designation', 'username', 'role', 'delete']
      : ['name', 'designation', 'username', 'role'];
  }

  ngOnInit(): void {
    this._route.data
      .pipe(
        take(1)
      )
      .subscribe((response) => {
        this.userDataSource.data = response['userdata'];
      }
      )
  }

  logout(): void {
    localStorage.clear();
    this._router.navigate(['login']);
  }

  deleteUser(userId: number): void {
    this._authenticationService.deleteUser(userId).subscribe(
      (response) => {
        console.log(response);
        if (response.isDone === 1) {
          this.userDataSource.data = this.userDataSource.data.filter(user => user.id !== userId);
          alert(response.message);
        }
      }
    );
  }

  updateRole(userId: string): void {
    this._authenticationService.updateUserRole(userId).subscribe(
      (response) => {
        console.log(response);
        if (response.isDone === 1) {
          const updatedUser = this.userDataSource.data.find(user => user.id === userId);
          if (updatedUser) {
            updatedUser.role = updatedUser.role === 'admin' ? 'user' : 'admin';
          }
        }
      }
    );
  }
}
