import { Routes } from '@angular/router';

import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { CalendarComponent } from './reservation/calendar/calendar.component';
import { ReservationComponent } from './reservation/reservation.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  // { path: 'calendar', component: CalendarComponent },
  { path: 'reservation', component: ReservationComponent },
  // { path: '', redirectTo: '/reservation', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/reservation', pathMatch: 'full' }, // Wildcard route for invalid URLs
];
