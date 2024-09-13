import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule, DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import * as ResActions from '../../store/reservations.actions';
import { ReservationService } from '../../services/reservation.service';
import { ReservationModel } from '../../models/reservations.model';
import { AppState } from '../../../shared/store/appState.interface';
import {
  reservationsSelector,
  selectedDaySelector,
} from '../../store/reservations.selectors';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule, DatePipe, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit {
  store = inject(Store<AppState>);

  utilService = inject(UtilsService);
  reservationService = inject(ReservationService);
  cdr = inject(ChangeDetectorRef);

  showCalendar = true;
  selectedDate: Date | null = null;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentViewDate: Date = new Date();

  reservations: ReservationModel[] = [];
  subscription: Subscription[] = [];

  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    this.initMaxDate();
    this.subscription.push(
      this.store.select(reservationsSelector).subscribe((reservations) => {
        this.reservations = reservations ? reservations : [];
        this.refreshCalendar();
      }),
      this.store.select(selectedDaySelector).subscribe((selectedDay) => {
        if (selectedDay) {
          this.selectedDate = new Date(selectedDay);
          this.refreshCalendar();
        }
      })
    );
  }

  initMaxDate() {
    const today = new Date();

    // Set minDate to one year before today
    this.minDate = new Date(
      today.getFullYear() - 1,
      today.getMonth(),
      today.getDate()
    );

    // Initialize maxDate to today if not already set
    if (!this.maxDate) {
      this.maxDate = new Date(today);
    }

    // Set maxDate to one year from today
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }

  select(date: Date | null) {
    if (!date) return;
    this.utilService.triggerVibration();

    this.store.dispatch(
      ResActions.selectedDay({ selectedDay: this.formatDate(date) })
    );
    this.refreshCalendar();
  }

  dateClass = (date: Date) => {
    const dateString = date.toDateString();

    // Check if the date is before today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize the time to 00:00:00

    const isPastDate = date < today;

    if (date < this.minDate) {
      return '';
    }

    const reservData = this.reservations.map((reservation) => ({
      ...reservation,
      dateString: new Date(reservation.date).toDateString(), //add new property
      isFullDay: this.isFullDate(reservation.date), //add new property
    }));

    if (this.selectedDate && dateString === this.selectedDate.toDateString()) {
      if (isPastDate) {
        if (this.isFullDate(dateString)) {
          return `selected-date-past-reserved-full-day`;
        }
        if (this.isSomeReservation(this.formatDate(date))) {
          return `selected-date-past-reserved-partial-day`;
        }

        return `selected-date-past`;
      } else {
        if (this.isFullDate(dateString)) {
          return `selected-date-reserved-full-day`;
        }
        if (this.isSomeReservation(this.formatDate(date))) {
          return `selected-date-reserved-partial-day`;
        }

        return `selected-date-available-date`;
      }
    }

    for (let reservation of reservData) {
      if (reservation.dateString === dateString) {
        if (isPastDate) {
          return reservation.isFullDay
            ? 'past-reserved-full-day'
            : 'past-reserved-partial-day';
        } else {
          return reservation.isFullDay
            ? 'reserved-full-day'
            : 'reserved-partial-day';
        }
      }
    }

    return isPastDate ? 'past-date' : 'available-date';
  };

  getReservationClass(dateString: string, reservData: any): string {
    for (let reservation of reservData) {
      if (reservation.date === dateString) {
        return reservation.isFullDay
          ? 'reserved-full-day'
          : 'reserved-partial-day';
      }
    }
    return '';
  }

  isFullDate(checkedDay: string): boolean {
    return false;
  }

  isSomeReservation(day: string): boolean {
    return this.reservations.some((res) => {
      const reservationDate = new Date(res.date).toDateString();
      const dayToCheck = new Date(day).toDateString();
      return reservationDate === dayToCheck;
    });
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  refreshCalendar() {
    this.showCalendar = false;
    this.cdr.detectChanges();
    this.showCalendar = true;
    this.cdr.detectChanges();
  }
}
