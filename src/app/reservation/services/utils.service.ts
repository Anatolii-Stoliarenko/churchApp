import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  mergeTimeSlots(timeSlots: string[]): string[] {
    if (timeSlots.length === 0) return [];

    const mergedSlots: string[] = [];
    let start = timeSlots[0].split(' - ')[0];
    let end = timeSlots[0].split(' - ')[1];

    for (let i = 1; i < timeSlots.length; i++) {
      const [currentStart, currentEnd] = timeSlots[i].split(' - ');

      if (currentStart === end) {
        end = currentEnd;
      } else {
        mergedSlots.push(`${start} - ${end}`);
        start = currentStart;
        end = currentEnd;
      }
    }

    mergedSlots.push(`${start} - ${end}`);
    return mergedSlots;
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
