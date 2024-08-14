import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatButtonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Close the dialog and return true
  }

  onCancel(): void {
    this.dialogRef.close(false); // Close the dialog and return false
  }
}
