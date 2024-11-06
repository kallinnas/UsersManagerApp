import { Component, HostListener, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Firestore, collection, addDoc, deleteDoc, doc, updateDoc, collectionData } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { CookieService } from 'ngx-cookie-service';
import { MatSort } from '@angular/material/sort';

import { EditUserDialogComponent } from '../../components/edit-user-dialog/edit-user-dialog.component';
import { AddUserDialogComponent } from '../../components/add-user-dialog/add-user-dialog.component';
import { GeneralModule } from '../../modules/general.model';
import { User } from '../../models/user.model';
import { UiService } from '../../services/ui.service';

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
  displayedColumns!: string[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private cookieService: CookieService,
    private firestore: Firestore,
    private dialog: MatDialog,
    public uiService: UiService,
  ) { }

  ngOnInit() {
    // this.generateAndAddUsers();
    this.setDisplayColumns();
    // this.loadUsersFromCookies();
    this.loadUsersFromFirestore();
    this.isMobileView = window.innerWidth <= 768;
  }

  setDisplayColumns() {
    try {
      if (window.innerWidth <= 768) {
        this.displayedColumns = ['firstName', 'lastName', 'age', 'countryIcon', 'cityIcon', 'edit', 'remove'];
      } else {
        this.displayedColumns = ['firstName', 'lastName', 'gender', 'age', 'country', 'city', 'edit', 'remove'];
      }
    }

    catch (err) {
      console.log(err, ' in setDisplayColumns ' + this.FILE_NAME);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadUsersFromFirestore(): void {
    this.uiService.spinnerOn();
    const usersCollection = collection(this.firestore, 'users');
    collectionData(usersCollection, { idField: 'id' }).subscribe((users: User[]) => {
      this.dataSource.data = users as User[];
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.uiService.spinnerOff();
    });
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

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          // const data = this.dataSource.data;
          // const newUserId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
          // const newUser: User = { ...result, id: newUserId };
          // this.dataSource.data = [...this.dataSource.data, newUser];
          // this.saveUsersToCookies();
          const usersCollection = collection(this.firestore, 'users');
          await addDoc(usersCollection, result);
          this.uiService.showSnackbar('User added successfully', 'Close', 3000);
        }
      });
    }

    catch (err) {
      console.log(err, ' in openAddUserDialog ' + this.FILE_NAME);
      this.uiService.showSnackbar('Error adding user', 'Close', 3000);
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

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          // const index = this.dataSource.data.findIndex((u: User) => u.id === userID);
          // this.dataSource.data[index] = result;
          // this.dataSource.data = [...this.dataSource.data];
          // this.saveUsersToCookies();
          const userDoc = doc(this.firestore, `users/${userID}`);
          await updateDoc(userDoc, result);
          this.uiService.showSnackbar('User updated successfully', 'Close', 3000);
        }
      });
    }

    catch (err) {
      console.log(err, ' in openEditDialog ' + this.FILE_NAME);
      this.uiService.showSnackbar('Error updating user', 'Close', 3000);
    }
  }

  removeUser(userID: number): void {
    try {
      // this.dataSource.data = this.dataSource.data.filter(user => user.id !== userID);
      // this.saveUsersToCookies();
      const userDoc = doc(this.firestore, `users/${userID}`);
      deleteDoc(userDoc).then(() => {
        console.log(`User with ID ${userID} deleted from Firestore`);
        this.uiService.showSnackbar('User deleted successfully', 'Close', 3000);
      });
    }

    catch (err) {
      console.log(err, ' in removeUser ' + this.FILE_NAME);
      this.uiService.showSnackbar('Error deleting user', 'Close', 3000);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobileView = (event.target as Window).innerWidth <= 768;
  }


  async generateAndAddUsers(): Promise<void> {
    const usersCollection = collection(this.firestore, 'users');
    const countries = ['USA', 'Canada', 'Germany', 'France', 'Japan'];
    const cities = ['New York', 'Toronto', 'Berlin', 'Paris', 'Tokyo'];
    const firstNames = ['John', 'Alice', 'Bob', 'Maria', 'David'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Williams', 'Jones'];

    for (let i = 0; i < 20; i++) {
      const newUser: User = {
        id: i + 1,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        gender: Math.random() > 0.5 ? 1 : 0,
        age: Math.floor(Math.random() * 40) + 20,
        country: countries[Math.floor(Math.random() * countries.length)],
        city: cities[Math.floor(Math.random() * cities.length)],
      };
      await addDoc(usersCollection, newUser);
    }

    this.uiService.showSnackbar('20 users added successfully', 'Close', 3000);
  }

}
