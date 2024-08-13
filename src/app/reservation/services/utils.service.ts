import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_CLASSES } from '../../config/snack-bar.config';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  snackBar = inject(MatSnackBar);

  snackBarSuccess(message: string): void {
    this.showSnackBar(message, SNACKBAR_CLASSES.SUCCESS);
  }

  snackBarError(message: string): void {
    this.showSnackBar(message, SNACKBAR_CLASSES.ERROR);
    console.error(message);
  }

  private showSnackBar(
    message: string,
    panelClass: string,
    duration: number = 3000
  ): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: [panelClass],
      // horizontalPosition: 'center',
      // verticalPosition: 'top',
    });
  }

  generateId(): string {
    return Math.random().toString(36) + Date.now().toString(36);
  }

  getTimeRangeArray(start: string, end: string): string[] {
    const times = [];
    let currentTime = start;

    while (currentTime !== end) {
      times.push(currentTime);
      currentTime = this.addMinutes(currentTime, 30);
    }
    times.push(end); // Include end time

    return times;
  }

  addMinutes(time: string, minsToAdd: number): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + minsToAdd);

    return date.toTimeString().substr(0, 5);
  }
}
