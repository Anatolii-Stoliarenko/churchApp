import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SNACKBAR_CONFIG } from '../config/snack-bar.config';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  snackBar = inject(MatSnackBar);

  snackBarSuccess(message: string): void {
    this.showSnackBar(message, SNACKBAR_CONFIG.success);
  }

  snackBarError(message: string): void {
    this.showSnackBar(message, SNACKBAR_CONFIG.error);
  }

  private showSnackBar(
    message: string,
    config: typeof SNACKBAR_CONFIG.success
  ): void {
    this.snackBar.open(message, 'Close', config);
  }

  greenConsole(message: string): void {
    console.log('%c' + message, 'color: green; font-weight: bold;');
  }

  triggerVibration() {
    if (navigator.vibrate) {
      navigator.vibrate(50); // Vibrate for 50 milliseconds
    } else {
      console.log('Vibration API not supported by this device.');
    }
  }
}
