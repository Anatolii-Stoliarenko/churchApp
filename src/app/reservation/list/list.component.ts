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

import {
  ReservationModel,
  ReservationStatus,
  UserModel,
} from '../reservation.model';
import { ReservationService } from '../services/reservation.service';
import { TimeComponent } from '../time/time.component';
import { SharedService } from '../services/shared.service';
import { RoleService } from '../../auth/role.service';
import { AuthService } from '../../auth/auth.service';
import { ReservationDetailDialogComponent } from '../reservation-detail-dialog/reservation-detail-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  dataSource: MatTableDataSource<ReservationModel>;

  dialog = inject(MatDialog);
  reservationService = inject(ReservationService);
  roleService = inject(RoleService);
  sharedService = inject(SharedService);
  authService = inject(AuthService);

  currentUser: UserModel | null = null;
  subscription: Subscription[] = [];

  // dataSource: ReservationModel[] = [];
  displayedColumns: string[] = [
    // 'date',
    'startHour',
    'endHour',
    'place',
    // 'user',
    'actions',
  ];

  constructor() {
    this.dataSource = new MatTableDataSource<ReservationModel>([]);
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;

    this.subscription.push(
      this.sharedService.selectedDay$.subscribe(() => {
        this.updateDataSource();
      })
    );

    this.subscription.push(
      this.sharedService.reservationMade$.subscribe(() => {
        this.updateDataSource();
      })
    );

    this.subscription.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
        this.updateDataSource();
      })
    );

    this.updateDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    console.log('Sort initialized:', this.sort);
    console.log('DataSource:', this.dataSource);
  }

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  openDialogDetails(reservation: ReservationModel) {
    this.dialog.open(ReservationDetailDialogComponent, {
      width: '250px',
      data: reservation,
    });
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

  isReservationCreatedByCurrentUser(reservation: ReservationModel): boolean {
    return this.currentUser?.id === reservation.user.id;
  }

  updateDataSource(): void {
    const selectedDay = this.sharedService.getSelectedDay();
    if (selectedDay) {
      this.dataSource.data =
        this.reservationService.getAllReservationsBySelectedDay(selectedDay);
    }
  }

  approve(reservation: ReservationModel): void {
    const id = reservation.id;
    if (!id) {
      console.error('Reservation ID is undefined');
      return;
    }
    const partialUpdate = {
      status: ReservationStatus.APPROVED,
    };
    this.reservationService.updateReservation(id, partialUpdate);
  }

  pennding(reservation: ReservationModel): void {
    const id = reservation.id;
    if (!id) {
      console.error('Reservation ID is undefined');
      return;
    }
    const partialUpdate = {
      status: ReservationStatus.PENDING,
    };
    this.reservationService.updateReservation(id, partialUpdate);
  }

  viewDetails(reservation: ReservationModel): void {
    console.log('View details for', reservation);
    this.openDialogDetails(reservation);
  }

  delete(reservation: ReservationModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reservationService.deleteReservation(reservation.id);
      }
    });
  }
}
