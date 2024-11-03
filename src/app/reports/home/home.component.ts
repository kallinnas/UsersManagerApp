import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user.model';
import { GeneralModule } from '../../modules/general.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  dataSource: MatTableDataSource<User> = new MatTableDataSource();
  
  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'gender',
    'age',
    'country',
    'city',
    'edit',
    'remove'
  ];

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {

  }

  openDeleteDialog(arg0: any) {

  }

}
