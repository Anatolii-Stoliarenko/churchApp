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
}
