import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CalendarComponent } from './reservation/calendar/calendar.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RegisterComponent } from './auth/register/register.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CalendarComponent,
    ReservationComponent,
    RegisterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
