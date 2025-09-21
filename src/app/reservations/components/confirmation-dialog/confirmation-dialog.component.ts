import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [MatDialogContent, MatDialogActions, MatButtonModule],
    templateUrl: './confirmation-dialog.component.html',
    styleUrl: './confirmation-dialog.component.scss',
})
export class ConfirmationDialogComponent implements OnInit {
    dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
    utilService = inject(UtilsService);

    ngOnInit(): void {
        this.utilService.triggerVibration();
    }
    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
