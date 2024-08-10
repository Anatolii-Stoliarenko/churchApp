import { Routes } from '@angular/router';

import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ReservationComponent } from './reservation/reservation.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'reservation',
    component: ReservationComponent,
    canActivate: [authGuard],
  },
  { path: '**', redirectTo: '/reservation', pathMatch: 'full' }, // Wildcard route for invalid URLs
];
