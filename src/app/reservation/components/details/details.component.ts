import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import {
  ReservationModel,
  ReservationStatus,
  ReservationType,
  updateReservationInterface,
} from '../../../reservation/models/reservations.model';
import { AppState } from '../../../../app/shared/store/appState.interface';
import * as ReservActions from '../../../reservation/store/reservations.actions';
import { ConfirmationDialogComponent } from '../../../../app/shared/components/confirmation-dialog/confirmation-dialog.component';
import { CurrentUserInterface } from '../../../auth/models/auth.model';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatButton,
    MatIconModule,
    MatMenuModule,
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  @Input() reservation: ReservationModel | null = null;
  @Input() currentUser: CurrentUserInterface | null = null;
  @Output() closeDetails = new EventEmitter<void>(); // Event emitter to notify parent component

  store = inject(Store<AppState>);
  dialog = inject(MatDialog);

  subscription: Subscription[] = [];

  onClose() {
    this.closeDetails.emit(); // Emit the event to notify the parent
  }

  //Delete Reservation
  delete(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.reservation) {
        this.store.dispatch(
          ReservActions.deleteReservations({ id: this.reservation.id })
        );
      }
    });
  }

  deleteReservations(selectedRows: ReservationModel[]): void {
    if (selectedRows.length === 0) {
      console.log('No reservations selected for deletion.');
      return;
    }

    selectedRows.forEach(({ id }) => {
      console.log(id); // Log the reservation ID
      this.store.dispatch(ReservActions.deleteReservations({ id }));
    });
  }
  //Updating reservations
  updateReservation(
    reservation: ReservationModel,
    payload: Partial<updateReservationInterface>
  ): void {
    const id = reservation.id;
    if (!id) {
      console.error('Reservation ID is undefined');
      return;
    }

    this.store.dispatch(ReservActions.updateReservations({ id, payload }));
  }

  edit(): void {
    if (this.reservation) {
      const { id, ...updatedReservationData } = this.reservation;
      // this.updateReservation(this.reservation, updatedReservationData);
      console.log('editing...');
    } else {
      console.error('Reservation ID is undefined');
      return;
    }
  }

  approve(): void {
    if (this.reservation) {
      this.updateReservation(this.reservation, {
        status: ReservationStatus.APPROVED,
      });
    }
  }

  pending(): void {
    if (this.reservation) {
      this.updateReservation(this.reservation, {
        status: ReservationStatus.PENDING,
      });
    }
  }

  typePl(): void {
    if (this.reservation) {
      this.updateReservation(this.reservation, { type: ReservationType.PL });
    }
  }

  typeUA(): void {
    if (this.reservation) {
      this.updateReservation(this.reservation, { type: ReservationType.UA });
    }
  }

  typeOther(): void {
    if (this.reservation) {
      this.updateReservation(this.reservation, { type: ReservationType.OTHER });
    }
  }

  changeReservationType(reservation: ReservationModel, type: ReservationType) {
    const id = reservation.id;
    if (!id) {
      console.error('Reservation ID is undefined');
      return;
    }
    const partialUpdate: updateReservationInterface = { type };
    this.store.dispatch(
      ReservActions.updateReservations({ id, payload: partialUpdate })
    );
  }
}
