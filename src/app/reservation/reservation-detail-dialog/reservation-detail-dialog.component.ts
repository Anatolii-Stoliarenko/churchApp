import { Component, inject, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

import { ReservationModel, UserModel } from '../reservation.model';

@Component({
  selector: 'app-reservation-detail-dialog',
  templateUrl: './reservation-detail-dialog.component.html',
  styleUrls: ['./reservation-detail-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    CommonModule,
  ],
})
export class ReservationDetailDialogComponent {
  dialogRef = inject(MatDialogRef<ReservationDetailDialogComponent>);
  reservation: ReservationModel = inject(MAT_DIALOG_DATA);

  closeDialog() {
    this.dialogRef.close();
  }
}
