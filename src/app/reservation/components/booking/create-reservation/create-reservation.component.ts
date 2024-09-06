import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { BookingComponent } from '../booking.component';
import { ReservationService } from '../../../services/reservation.service';
import { AppState } from '../../../../shared/store/appState.interface';
import { selectedDaySelector } from '../../../store/reservations.selectors';
import { BookingModel } from '../../../models/reservations.model';
import { ReservationDetailDialogComponent } from '../../detail-dialog/detail-dialog.component';
import { UserInterface } from '../../../../auth/models/auth.model';
import { currentUserSelector } from '../../../../auth/store/auth.selectors';

@Component({
  selector: 'app-create-reservation',
  standalone: true,
  imports: [CommonModule, BookingComponent],
  templateUrl: './create-reservation.component.html',
  styleUrl: './create-reservation.component.scss',
})
export class CreateReservationComponent {
  reserveService = inject(ReservationService);
  store = inject(Store<AppState>);
  dialog = inject(MatDialog);

  subscription: Subscription[] = [];

  selectedDay = '';
  currentUser: UserInterface | null = null;
  isChildVisible = true;

  ngOnInit(): void {
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
      }),

      this.store.select(currentUserSelector).subscribe((user) => {
        this.currentUser = user;
      })
    );
  }

  confirmReservation(data: BookingModel) {
    const dialogRef = this.dialog.open(ReservationDetailDialogComponent, {
      width: '250px',
      data: {
        ...this.reserveService.getDataForConfirmDialog(data),
        caller: 'reserve',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const reservation: BookingModel = {
          ...data,
          date: this.selectedDay,
        };
        this.reserveService.prepareReservation(reservation);
      }
    });
  }

  private reloadBookingComponent(): void {
    this.isChildVisible = false;
    setTimeout(() => {
      this.isChildVisible = true;
    }, 0);
  }
}