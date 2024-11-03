import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { GeneralModule } from '../../modules/general.model';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss'
})
export class EditUserDialogComponent {
  userForm: FormGroup;
  genderOptions = ['Female', 'Male'];
  countries: string[] = [];
  filteredCountries!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // data contains the user details for editing
  ) {
    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(1)]],
      gender: ['', Validators.required],
      country: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Load country list from API
    this.loadCountries();

    // Set initial values if editing an existing user
    if (this.data?.user) {
      this.userForm.patchValue(this.data.user);
    }

    // Set up autocomplete filtering for the country field
    this.filteredCountries = this.userForm.controls['country'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountries(value))
    );
  }

  private loadCountries() {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(countries => {
      this.countries = countries.map(country => country.name.common);
    });
  }

  private _filterCountries(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(country => country.toLowerCase().includes(filterValue));
  }

  save(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value); // Pass form data back to the calling component
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
