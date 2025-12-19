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
export class DashboardComponent implements OnInit{

  userDataSource: MatTableDataSource<any>;
  userColumns: string[];

  constructor( private _authenticationService: AuthenticationService,
                private _route: ActivatedRoute,
                private _router: Router

  )
  {
    this.userDataSource = new MatTableDataSource<any>();
    this.userColumns = ['name', 'designation', 'username', 'password'];
  }

  ngOnInit(): void
  {
    this._route.data
      .pipe(
        take(1)
      )
      .subscribe((response) => {
        this.userDataSource.data = response['userdata'];
      }
    )
  }

  logout(): void
  {
    localStorage.clear();
    this._router.navigate(['login']);
  }

}
