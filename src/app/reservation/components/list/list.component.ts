import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
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
  ReservationType,
  updateReservationInterface,
} from '../../models/reservations.model';
import { ReservationService } from '../../services/reservation.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ReservationDetailDialogComponent } from '../detail-dialog/detail-dialog.component';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AppState } from '../../../shared/store/appState.interface';
import { currentUserSelector } from '../../../auth/store/auth.selectors';
import { selectedDaySelector } from '../../store/reservations.selectors';
import * as ReservActions from '../../store/reservations.actions';
import { CurrentUserInterface } from '../../../auth/models/auth.model';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ReservationDetailDialogComponent,
    MatDialogModule,
    MatCardModule,
    MatMenuModule,
    MatSortModule,
    MatSort,
    DetailsComponent,
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

  displayedColumns: string[] = [
    'type',
    'time',
    // 'startHour',
    // 'endHour',
    'place',
    // 'actions',
    'comment',
  ];

  selectedRow: ReservationModel | null = null;

  // Method to select a row
  selectRow(row: ReservationModel) {
    // If the clicked row is already selected, deselect it
    if (this.selectedRow === row) {
      this.selectedRow = null;
    } else {
      // Otherwise, select the new row
      this.selectedRow = row;
    }
  }

  // Apply CSS class based on reservation status and selection
  getRowClass(reservation: ReservationModel): string {
    if (this.selectedRow === reservation) {
      return 'selected-row'; // Apply selected row class
    }
    if (!reservation.status) {
      return '';
    }
    switch (reservation.status) {
      case ReservationStatus.APPROVED:
        return 'approved-row';
      case ReservationStatus.PENDING:
        return 'pending-row';
      default:
        return '';
    }
  }

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

  updateDataSource(): void {
    if (this.selectedDay) {
      this.dataSource.data =
        this.reservationService.getAllReservationsBySelectedDay(
          this.selectedDay
        );
    }
  }

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

  approve(reservation: ReservationModel): void {
    this.updateReservation(reservation, { status: ReservationStatus.APPROVED });
  }

  pending(reservation: ReservationModel): void {
    this.updateReservation(reservation, { status: ReservationStatus.PENDING });
  }

  edit(reservation: ReservationModel): void {
    // Remove `id` from the payload because `id` is passed separately
    const { id, ...updatedReservationData } = reservation;

    if (!id) {
      console.error('Reservation ID is undefined');
      return;
    }

    // Update all fields except the `id`
    this.updateReservation(reservation, updatedReservationData);
  }

  typePl(reservation: ReservationModel): void {
    this.updateReservation(reservation, { type: ReservationType.PL });
  }

  typeUA(reservation: ReservationModel): void {
    this.updateReservation(reservation, { type: ReservationType.UA });
  }

  typeOther(reservation: ReservationModel): void {
    this.updateReservation(reservation, { type: ReservationType.OTHER });
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

  delete(reservation: ReservationModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(
          ReservActions.deleteReservations({ id: reservation.id })
        );
        // this.deleteReservations(this.selectedRows);
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
