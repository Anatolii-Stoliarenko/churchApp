import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
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
