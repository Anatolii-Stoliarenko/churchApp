import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

import { CalendarComponent } from './components/calendar/calendar.component';
import { ListComponent } from './components/list/list.component';
import { HeaderComponent } from '../shared/components/header/header.component';
import { AppState } from '../shared/store/appState.interface';
import { LoadingComponent } from '../shared/components/loading/loading.component';
import * as ReservActions from './store/reservations.actions';
import {
  loadingReservationsSelector,
  loadingUpdateReservationsSelector,
} from './store/reservations.selectors';
import { CreateReservationComponent } from './components/create-reservation/create-reservation.component';
import { CurrentUserInterface } from '../auth/models/auth.model';
import { currentUserSelector } from '../auth/store/auth.selectors';
import { DetailsComponent } from './components/details/details.component';
import { selectedDaySelector } from '../reservation/store/reservations.selectors';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    CalendarComponent,
    ListComponent,
    HeaderComponent,
    RouterOutlet,
    LoadingComponent,
    CreateReservationComponent,
    MatTabsModule,
    MatIconModule,
    DetailsComponent,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
  @ViewChild('tabGroup') tabGroup: MatTabGroup | undefined;

  store = inject(Store<AppState>);
  isLoading$: Observable<boolean> | undefined;
  isLoadingUpdateReservation$: Observable<boolean> | undefined;
  currentUser$: Observable<CurrentUserInterface | null> | undefined;
  selectedDay: string | null | undefined;
  isChildVisible = true;
  subscription: Subscription[] = [];

  ngOnInit() {
    this.isLoading$ = this.store.select(loadingReservationsSelector);
    this.isLoadingUpdateReservation$ = this.store.select(
      loadingUpdateReservationsSelector
    );
    this.currentUser$ = this.store.select(currentUserSelector);

    this.store.dispatch(ReservActions.getReservations());
    this.initValues();
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  initValues(): void {
    this.subscription.push(
      this.store.select(selectedDaySelector).subscribe((day) => {
        day ? (this.selectedDay = day) : '';
        this.reloadBookingComponent();
      })
    );
  }

  private reloadBookingComponent(): void {
    this.isChildVisible = false;
    setTimeout(() => {
      this.isChildVisible = true;
    }, 0);
  }

  // Method to navigate to the "Reserve" tab
  goToReserveTab(): void {
    if (this.tabGroup) {
      this.tabGroup.selectedIndex = 1; // Switch to the second tab (Reserve tab)
    }
  }

  // Ensure tabGroup is available after the view has been initialized
  ngAfterViewInit(): void {
    if (!this.tabGroup) {
      console.error('MatTabGroup not initialized');
    }
  }
}
