import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SNACKBAR_CONFIG } from '../../config/snack-bar.config';

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

  showSnackBar(message: string, config: typeof SNACKBAR_CONFIG.success): void {
    this.snackBar.open(message, 'Close', config);
  }

  generateId(): string {
    return Math.random().toString(36) + Date.now().toString(36);
  }
}
