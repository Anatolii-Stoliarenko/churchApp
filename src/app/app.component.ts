import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CalendarComponent } from './reservation/calendar/calendar.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RegisterComponent } from './auth/register/register.component';
import { HeaderComponent } from './header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CalendarComponent,
    ReservationComponent,
    RegisterComponent,
    HeaderComponent,
    MatSnackBarModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
