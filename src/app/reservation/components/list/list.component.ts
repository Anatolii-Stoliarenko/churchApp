import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import {
  ReservationModel,
  ReservationStatus,
  updateReservationInterface,
} from '../../models/reservations.model';
import { ReservationService } from '../../services/reservation.service';
import { TimeComponent } from '../time/time.component';
import { AuthService } from '../../../auth/services/auth.service';
import { ReservationDetailDialogComponent } from '../reservation-detail-dialog/reservation-detail-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AppState } from '../../../shared/store/appState.interface';
import { currentUserSelector } from '../../../auth/store/selectors/auth.selectors';
import { selectedDaySelector } from '../../store/reservations.selectors';
import * as ReservActions from '../../store/reservations.actions';
import { CurrentUserInterface } from '../../../auth/models/auth.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    TimeComponent,
    MatButtonModule,
    MatIconModule,
    ReservationDetailDialogComponent,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatSortModule,
    MatSort,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  dataSource: MatTableDataSource<ReservationModel>;

  store = inject(Store<AppState>);
  dialog = inject(MatDialog);
  reservationService = inject(ReservationService);
  authService = inject(AuthService);

  currentUser: CurrentUserInterface | null = null;
  selectedDay: string | null | undefined;
  subscription: Subscription[] = [];

  displayedColumns: string[] = ['startHour', 'endHour', 'place', 'actions'];

  constructor() {
    this.dataSource = new MatTableDataSource<ReservationModel>([]);
  }

  ngOnInit(): void {
    this.initializeListeners();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  initializeListeners(): void {
    this.subscription.push(
      this.store.select(selectedDaySelector).subscribe((day) => {
        this.selectedDay = day;
        this.updateDataSource();
      }),

      this.store.select(currentUserSelector).subscribe((user) => {
        this.currentUser = user;
        this.updateDataSource();
      })
    );
  }

  getRowClass(reservation: ReservationModel): string {
    if (!reservation.status) {
      return '';
    }
    switch (reservation.status) {
      case ReservationStatus.APPROVED:
        return 'approved-row';
      case ReservationStatus.PENDING:
        return 'pending-row';
    }
  }

  updateDataSource(): void {
    if (this.selectedDay) {
      this.dataSource.data =
        this.reservationService.getAllReservationsBySelectedDay(
          this.selectedDay
        );
    }
  }

  approve(reservation: ReservationModel): void {
    this.changeReservationStatus(reservation, ReservationStatus.APPROVED);
  }

  pending(reservation: ReservationModel): void {
    this.changeReservationStatus(reservation, ReservationStatus.PENDING);
  }

  changeReservationStatus(
    reservation: ReservationModel,
    status: ReservationStatus
  ): void {
    const id = reservation.id;
    if (!id) {
      console.error('Reservation ID is undefined');
      return;
    }
    const partialUpdate: updateReservationInterface = { status };
    this.store.dispatch(
      ReservActions.updateReservations({ id, payload: partialUpdate })
    );
  }

  delete(reservation: ReservationModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          ReservActions.deleteReservations({ id: reservation.id })
        );
      }
    });
  }

  viewDetails(reservation: ReservationModel): void {
    console.log('View details for', reservation);
    this.openDialogDetails(reservation);
  }

  openDialogDetails(reservation: ReservationModel) {
    this.dialog.open(ReservationDetailDialogComponent, {
      width: '250px',
      data: reservation,
    });
  }
}
