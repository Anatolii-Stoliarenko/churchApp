import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CalendarComponent } from './calendar/calendar.component';
import { ListComponent } from './list/list.component';
import { HeaderComponent } from '../header/header.component';
import { TimeComponent } from './time/time.component';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CalendarComponent,
    ListComponent,
    HeaderComponent,
    RouterOutlet,
    TimeComponent,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {}
