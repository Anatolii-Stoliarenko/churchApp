import { Component } from '@angular/core';

import { CalendarComponent } from './calendar/calendar.component';
import { ListComponent } from './list/list.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { TimeComponent } from './time/time.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CalendarComponent,
    ListComponent,
    HeaderComponent,
    RouterOutlet,
    TimeComponent,
    MatSelectModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {}
