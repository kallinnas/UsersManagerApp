import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, startWith, map } from 'rxjs';
import { User } from '../../models/user.model';
import { GeneralModule } from '../../modules/general.model';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  imports: [GeneralModule],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss'
})
export class AddUserDialogComponent {
  userForm: FormGroup;
  countries: string[] = [];
  filteredCountries$!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddUserDialogComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: { user: User | null }
  ) {
    this.userForm = this.fb.group({
      firstName: [data.user?.firstName || '', Validators.required],
      lastName: [data.user?.lastName || '', Validators.required],
      age: [data.user?.age || '', [Validators.required, Validators.min(1)]],
      gender: [data.user?.gender || '', Validators.required],
      country: [data.user?.country || '', Validators.required],
      city: [data.user?.city || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCountries();

    // Set up autocomplete filtering for the country field
    this.filteredCountries$ = this.userForm.get('country')!.valueChanges.pipe(
      startWith(''),
      map(value => this._filterCountries(value || ''))
    );
  }

  private loadCountries(): void {
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
      this.dialogRef.close(this.userForm.value); // Pass form data to parent component
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
