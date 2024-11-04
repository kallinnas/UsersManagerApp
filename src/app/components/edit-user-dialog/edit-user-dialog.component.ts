import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { Observable, startWith, map } from 'rxjs';

import { GeneralModule } from '../../modules/general.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent {

  private FILE_NAME: string = 'edit-user-dialog.ts';
  countryUrl: string = environment.countryUrl;
  userForm!: FormGroup;
  genderOptions = ['Female', 'Male', 'Other'];
  countries: string[] = [];
  filteredCountries!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadCountries();

    if (this.data?.user) {
      this.userForm.patchValue(this.data.user);
    }

    this.filteredCountries = this.userForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountries(value))
    );
  }

  initForm() {
    try {
      this.userForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        age: ['', [Validators.required, Validators.min(1)]],
        gender: ['', Validators.required],
        country: ['', Validators.required],
        city: ['', Validators.required]
      });

    }

    catch (err) {
      console.log(err, ' in initForm ' + this.FILE_NAME);
    }
  }

  private loadCountries() {
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
