import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';

import { EditUserDialogComponent } from '../../components/edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from '../../components/add-user-dialog/add-user-dialog.component';
import { GeneralModule } from '../../modules/general.model';
import { User } from '../../models/user.model';

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
    private cookieService: CookieService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.loadUsersFromCookies();
  }

  loadUsersFromCookies(): void {
    const usersCookie = this.cookieService.get('users');
    this.dataSource.data = usersCookie ? JSON.parse(usersCookie) : [];
  }

  saveUsersToCookies(): void {
    this.cookieService.set('users', JSON.stringify(this.dataSource.data));
  }
  
  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      width: '420px',
      data: { user: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
        this.saveUsersToCookies();
      }
    });
  }

  openEditDialog(userID: number): void {
    const user = this.dataSource.data.find(u => u.id === userID);
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex((u: User) => u.id === userID);
        this.dataSource.data[index] = result;
        this.dataSource.data = [...this.dataSource.data];
        this.saveUsersToCookies();
      }
    });
  }

  removeUser(userID: number): void {
    this.dataSource.data = this.dataSource.data.filter(user => user.id !== userID);
    this.saveUsersToCookies();
  }
}
