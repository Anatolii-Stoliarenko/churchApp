import { Component } from '@angular/core';

import { CalendarComponent } from './calendar/calendar.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [CalendarComponent, ListComponent],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
  selectedDay: string = '';

  onSelectedDay(date: string) {
    this.selectedDay = date;
  }
}
