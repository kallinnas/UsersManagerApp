import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { Component, HostListener } from '@angular/core';

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

  private FILE_NAME: string = 'home.ts';
  isMobileView: boolean = window.innerWidth <= 768;
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
    this.isMobileView = window.innerWidth <= 768;

    if (window.innerWidth <= 768) {
      this.displayedColumns = ['firstName', 'lastName', 'gender', 'age', 'countryIcon', 'cityIcon', 'edit', 'remove'];
    } else {
      this.displayedColumns = ['firstName', 'lastName', 'gender', 'age', 'country', 'city', 'edit', 'remove'];
    }
  }

  loadUsersFromCookies(): void {
    try {
      const usersCookie = this.cookieService.get('users');
      this.dataSource.data = usersCookie ? JSON.parse(usersCookie) : [];
    }

    catch (err) {
      console.log(err, ' in loadUsersFromCookies ' + this.FILE_NAME);
    }
  }

  saveUsersToCookies(): void {
    try {
      this.cookieService.set('users', JSON.stringify(this.dataSource.data));
    }

    catch (err) {
      console.log(err, ' in saveUsersToCookies ' + this.FILE_NAME);
    }
  }

  openAddUserDialog(): void {
    try {
      const dialogRef = this.dialog.open(AddUserDialogComponent, {
        autoFocus: false,
        width: '300px',
        data: { user: null }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          const newUserId = this.dataSource.data.length > 0
            ? Math.max(...this.dataSource.data.map(user => user.id)) + 1 : 1;

          const newUser: User = { ...result, id: newUserId };
          this.dataSource.data = [...this.dataSource.data, newUser];
          this.saveUsersToCookies();
        }
      });
    }

    catch (err) {
      console.log(err, ' in openAddUserDialog ' + this.FILE_NAME);
    }
  }

  openEditDialog(userID: number): void {
    try {
      const user = this.dataSource.data.find(u => u.id === userID);
      const dialogRef = this.dialog.open(EditUserDialogComponent, {
        autoFocus: false,
        width: '300px',
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

    catch (err) {
      console.log(err, ' in openEditDialog ' + this.FILE_NAME);
    }
  }

  removeUser(userID: number): void {
    try {
      this.dataSource.data = this.dataSource.data.filter(user => user.id !== userID);
      this.saveUsersToCookies();
    }

    catch (err) {
      console.log(err, ' in removeUser ' + this.FILE_NAME);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileView = (event.target as Window).innerWidth <= 768;
  }
}
