import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';

import { CalendarComponent } from './components/calendar/calendar.component';
import { ListComponent } from './components/list/list.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { TimeComponent } from './components/time/time.component';
import { AppState } from '../shared/store/appState.interface';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import * as ReservActions from './store/reservations.actions';
import { loadingReservationsSelector, loadingUpdateReservationsSelector } from './store/reservations.selectors';
import { CreateReservationComponent } from "./components/booking/create-reservation/create-reservation.component";

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    ListComponent,
    HeaderComponent,
    RouterOutlet,
    TimeComponent,
    LoadingComponent,
    CreateReservationComponent
],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
  store = inject(Store<AppState>);
  isLoading$: Observable<boolean> | undefined;
  isLoadingUpdateReservation$: Observable<boolean> | undefined;

  ngOnInit() {
    this.isLoading$ = this.store.select(loadingReservationsSelector);
    this.isLoadingUpdateReservation$ = this.store.select(loadingUpdateReservationsSelector);
    
    this.store.dispatch(ReservActions.getReservations());
  }
}
