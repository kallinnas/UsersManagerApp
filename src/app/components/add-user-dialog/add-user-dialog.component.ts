import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { User } from '../../models/user.model';
import { GeneralModule } from '../../modules/general.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss'
})
export class AddUserDialogComponent {

  private FILE_NAME: string = 'add-user-dialog.ts';
  countryUrl: string = environment.countryUrl;
  userForm!: FormGroup;
  genderOptions = ['Female', 'Male', 'Other'];
  countries: string[] = [];
  filteredCountries$!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { user: User | null }
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCountries();

    this.filteredCountries$ = this.userForm.get('country')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountries(value || ''))
    );
  }

  initForm() {
    try {
      this.userForm = this.fb.group({
        firstName: [this.data.user?.firstName || '', Validators.required],
        lastName: [this.data.user?.lastName || '', Validators.required],
        age: [this.data.user?.age || '', [Validators.required, Validators.min(1)]],
        gender: [this.data.user?.gender || '', Validators.required],
        country: [this.data.user?.country || '', Validators.required],
        city: [this.data.user?.city || '', Validators.required],
      });
    }

    catch (err) {
      console.log(err, ' in initForm ' + this.FILE_NAME);
    }
  }

  private loadCountries(): void {
    try {
      this.http.get<any[]>(this.countryUrl).subscribe(countries => {
        this.countries = countries.map(country => country.name.common);
      });
    }

    catch (err) {
      console.log(err, ' in loadCountries ' + this.FILE_NAME);
    }
  }

  private _filterCountries(value: string): string[] {
    try {
      const filterValue = value.toLowerCase();
      return this.countries.filter(country => country.toLowerCase().includes(filterValue));
    }

    catch (err) {
      console.log(err, ' in _filterCountries ' + this.FILE_NAME);
      return [];
    }
  }

  save(): void {
    try {
      if (this.userForm.valid) {
        this.dialogRef.close(this.userForm.value);
      }
    }

    catch (err) {
      console.log(err, ' in save ' + this.FILE_NAME);
    }
  }

  close(): void { this.dialogRef.close(); }
}
