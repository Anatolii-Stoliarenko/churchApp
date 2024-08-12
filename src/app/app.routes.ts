import { Routes } from '@angular/router';

import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { ReservationComponent } from './reservation/reservation.component';
import { authGuard } from './auth/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' }, // Default route redirects to login
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'reservation',
    component: ReservationComponent,
    canActivate: [authGuard],
  },
  { path: '404', component: NotFoundComponent }, // 404 Route
  { path: '**', redirectTo: '/404', pathMatch: 'full' }, // Wildcard Route
];
