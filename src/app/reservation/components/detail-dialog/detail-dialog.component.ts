import { Component, inject } from '@angular/core';
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
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'app-reservation-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.scss'],
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
  utilService = inject(UtilsService);
  reservation: any = inject(MAT_DIALOG_DATA);

  ngOnInit() {
    this.utilService.triggerVibration();
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
