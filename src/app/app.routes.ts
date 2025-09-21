import { Routes } from '@angular/router';

import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { ReservationComponent } from './reservations/reservation.component';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { authGuard } from './auth/guards/auth.guard';
import { AdminComponent } from './auth/components/admin/admin.component';

export const routes: Routes = [
    { path: '', redirectTo: 'reservation', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'admin', component: AdminComponent },

    {
        path: 'reservation',
        component: ReservationComponent,
        // canActivate: [authGuard],
    },
    { path: '**', redirectTo: '/404', pathMatch: 'full' },
    { path: '404', component: NotFoundComponent },
];
