import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule, DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  @Output() selectedDay = new EventEmitter<string>();
  showCalendar = true;
  selectedDate: Date | null = null;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  currentViewDate: Date = new Date();

  rs = inject(ReservationService);
  cdr = inject(ChangeDetectorRef);

  constructor() {}

  ngOnInit(): void {
    this.initMaxDate();
  }

  initMaxDate() {
    this.minDate = new Date(new Date().setHours(0, 0, 0, 0));
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  dateClass = (date: Date) => {
    const dateString = date.toDateString();

    if (date < this.minDate) {
      return '';
    }

    const reservData = this.rs.dataService.reservations.map((reservation) => ({
      ...reservation,
      dateString: new Date(reservation.date).toDateString(), //add new property
      isFullDay: this.isFullDayReserved(reservation), //add new property
    }));

    if (
      this.selectedDate &&
      date.toDateString() === this.selectedDate.toDateString()
    ) {
      return 'selected-date';
    }

    for (let reservation of reservData) {
      if (reservation.dateString === dateString) {
        return reservation.isFullDay
          ? 'reserved-full-day'
          : 'reserved-partial-day';
      }
    }

    return 'available-date';
  };

  isFullDayReserved(reservation: any): boolean {
    return this.rs.getfullDayHours(reservation);
  }

  select(date: Date | null) {
    if (!date) return;

    this.selectedDate = date;
    console.log(this.formatDate(this.selectedDate));
    this.selectedDay.emit(this.formatDate(this.selectedDate));
    this.refreshCalendar();
  }

  refreshCalendar() {
    this.showCalendar = false;
    this.cdr.detectChanges();
    this.showCalendar = true;
    this.cdr.detectChanges(); // Manually trigger change detection
  }
}
