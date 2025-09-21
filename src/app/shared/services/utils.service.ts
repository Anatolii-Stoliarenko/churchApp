import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SNACKBAR_CONFIG } from '../../core/config/snack-bar.config';
import { LoggerService } from '../../core/services/logger.service';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    snackBar = inject(MatSnackBar);
    private readonly loggerService = inject(LoggerService);

    snackBarSuccess(message: string): void {
        this.showSnackBar(message, SNACKBAR_CONFIG.success);
    }

    snackBarError(message: string): void {
        this.showSnackBar(message, SNACKBAR_CONFIG.error);
    }

    private showSnackBar(message: string, config: typeof SNACKBAR_CONFIG.success): void {
        this.snackBar.open(message, 'Close', config);
    }

    greenConsole(message: string): void {
        this.loggerService.log('%c' + message, 'color: green; font-weight: bold;');
    }

    triggerVibration() {
        if (navigator.vibrate) {
            navigator.vibrate(40);
            this.loggerService.log('Vibration for 40 milliseconds');
        } else {
            this.loggerService.log('Vibration API not supported by this device.');
        }
    }
}
