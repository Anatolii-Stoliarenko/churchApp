import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  private selectedDaySource = new BehaviorSubject<string>('');
  private reservationMadeSource = new BehaviorSubject<void>(undefined);

  selectedDay$ = this.selectedDaySource.asObservable();
  reservationMade$ = this.reservationMadeSource.asObservable();

  setSelectedDay(day: string) {
    this.selectedDaySource.next(day);
  }

  getSelectedDay(): string {
    return this.selectedDaySource.getValue();
  }

  notifyReservationMade() {
    this.reservationMadeSource.next();
  }

  isSelectedDayTodayOrFuture(): boolean {
    let selectedDate = new Date(this.getSelectedDay());
    const today = new Date();
    // Set time to 00:00:00 to compare only the dates, not the time
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // Return true if selectedDate is today or in the future
    return selectedDate >= today;
  }
}
