import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class UiService {

  isSpinning: boolean = false;

  constructor(private snackbar: MatSnackBar) { }

  spinnerOn() {
    this.isSpinning = true;
  }

  spinnerOff() {
    this.isSpinning = false;
  }

  showSnackbar(message: string, action: string, duration: number) {
    this.snackbar.open(message, action, { duration: duration });
  }
}
