import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';

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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  dialog = inject(MatDialog);
  reservationService = inject(ReservationService);
  roleService = inject(RoleService);
  sharedService = inject(SharedService);
  authService = inject(AuthService);

  currentUser: UserModel | null = null;
  subscription: Subscription[] = [];

  dataSource: ReservationModel[] = [];
  displayedColumns: string[] = [
    // 'date',
    'startHour',
    'endHour',
    'place',
    // 'user',
    'actions',
  ];

  ngOnInit(): void {
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

  ngOnDestroy(): void {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  openDialog(reservation: ReservationModel) {
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
      case ReservationStatus.REJECTED:
        return 'rejected-row';
    }
  }

  isReservationCreatedByCurrentUser(reservation: ReservationModel): boolean {
    return this.currentUser?.id === reservation.user.id;
  }

  updateDataSource(): void {
    const selectedDay = this.sharedService.getSelectedDay();
    if (selectedDay) {
      this.dataSource =
        this.reservationService.getAllReservationsBySelectedDay(selectedDay);
    }
  }

  reject(reservation: ReservationModel): void {
    this.reservationService.setReservationStatus(
      reservation,
      ReservationStatus.REJECTED
    );
  }

  approve(reservation: ReservationModel): void {
    this.reservationService.setReservationStatus(
      reservation,
      ReservationStatus.APPROVED
    );
  }

  pennding(reservation: ReservationModel): void {
    this.reservationService.setReservationStatus(
      reservation,
      ReservationStatus.PENDING
    );
  }

  viewDetails(reservation: ReservationModel): void {
    console.log('View details for', reservation);
    this.openDialog(reservation);
  }

  delete(reservation: ReservationModel): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // User clicked "Delete", proceed with deletion
        this.reservationService.deleteReservation(reservation);
      }
    });
  }
}
