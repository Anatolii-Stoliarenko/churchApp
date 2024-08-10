import { Component, inject, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ReservationModel, ReservationStatus } from '../reservation.model';
import { ReservationService } from '../services/reservation.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-reservation-detail-dialog',
  templateUrl: './reservation-detail-dialog.component.html',
  styleUrls: ['./reservation-detail-dialog.component.scss'],
})
export class ReservationDetailDialogComponent implements OnInit {
  isAdmin: boolean | null = null;
  authService = inject(AuthService); // Assuming this service manages user roles

  constructor(
    public dialogRef: MatDialogRef<ReservationDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public reservation: ReservationModel,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin(); // Determine if the current user is an admin
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmReservation(): void {
    this.reservation.status = ReservationStatus.APPROVED;
    this.reservation.approvalInfo = {
      approvedBy: 'test',
      approvalDate: new Date(),
      comments: 'Reservation approved by admin.',
    };
    this.reservationService.updateReservation(this.reservation);
    this.dialogRef.close(this.reservation);
  }

  rejectReservation(): void {
    this.reservation.status = ReservationStatus.REJECTED;
    this.reservation.approvalInfo = {
      approvedBy: 'test',
      approvalDate: new Date(),
      comments: 'Reservation rejected by admin.',
    };
    this.reservationService.updateReservation(this.reservation);
    this.dialogRef.close(this.reservation);
  }
}
