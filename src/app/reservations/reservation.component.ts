import { Component, inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CalendarComponent } from './components/calendar/calendar.component';
import { ListComponent } from './components/list/list.component';
import { HeaderComponent } from '../core/components/header/header.component';
import { AppState } from '../shared/store/appState.interface';
import { LoadingComponent } from '../core/components/loading/loading.component';
import * as ReservActions from './store/reservations.actions';
import { loadingReservationsSelector, loadingUpdateReservationsSelector, reservationsSelector } from './store/reservations.selectors';
import { CreateReservationComponent } from './components/create-reservation/create-reservation.component';
import { currentUserSelector } from '../auth/store/auth.selectors';
import { selectedDaySelector } from './store/reservations.selectors';
import { ReservationModel } from './models/reservations.model';
import { ReservationService } from './services/reservation.service';
import { FullListComponent } from './components/full-list/full-list.component';
import { BottomComponent } from '../core/components/footer/footer.component';

@Component({
    selector: 'app-reservation',
    standalone: true,
    imports: [
        CommonModule,
        CalendarComponent,
        ListComponent,
        HeaderComponent,
        LoadingComponent,
        CreateReservationComponent,
        MatTabsModule,
        MatIconModule,
        MatTabGroup,
        FullListComponent,
        MatCardModule,
        BottomComponent,
        MatTooltipModule,
    ],
    templateUrl: './reservation.component.html',
    styleUrl: './reservation.component.scss',
})
export class ReservationComponent {
    @ViewChild('tabGroup') tabGroup: MatTabGroup | undefined;

    store = inject(Store<AppState>);
    reservationService = inject(ReservationService);
    isLoading$ = this.store.select(loadingReservationsSelector);
    isLoadingUpdateReservation$ = this.store.select(loadingUpdateReservationsSelector);

    currentUser$ = this.store.select(currentUserSelector);
    selectedDay: string | null | undefined;
    isChildVisible = true;
    subscription: Subscription[] = [];
    reservation: ReservationModel[] = [];

    ngOnInit() {
        this.store.dispatch(ReservActions.getReservations());
        this.initValues();
    }

    ngOnDestroy(): void {
        this.subscription.forEach(subscription => subscription.unsubscribe());
    }

    initValues(): void {
        this.subscription.push(
            this.store.select(selectedDaySelector).subscribe(day => {
                day ? (this.selectedDay = day) : '';
                this.reloadBookingComponent();
                this.updateReservation();
            }),

            this.store.select(reservationsSelector).subscribe(() => this.updateReservation()),
        );
    }

    private updateReservation(): void {
        if (this.selectedDay) {
            this.reservation = this.reservationService.getReservationsByDay(this.selectedDay);
        }
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

    goToDay(): void {
        if (this.tabGroup) {
            this.tabGroup.selectedIndex = 0; // Switch to the second tab (Reserve tab)
        }
    }

    goToList(): void {
        if (this.tabGroup) {
            this.tabGroup.selectedIndex = 2; // Switch to the second tab (Reserve tab)
        }
    }
}
