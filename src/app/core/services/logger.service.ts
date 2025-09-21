import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment.production';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  log(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.log(`[LOG] ${message}`, ...optionalParams);
    }
  }

  warn(message: string, ...optionalParams: unknown[]): void {
    if (!environment.production) {
      console.warn(`[WARN] ${message}`, ...optionalParams);
    }
  }

  error(message: string, ...optionalParams: unknown[]): void {
    console.error(`[ERROR] ${message}`, ...optionalParams);
  }

  critical(message: string, ...params: unknown[]): void {
    console.error(`[CRITICAL] ${message}`, ...params);
    this.sendToBackend(message, params);
  }

  private sendToBackend(message: string, params: unknown[]): void {
    this.log(`[TEST] [SENDING TO SERVER...] ${message}`, params);
  }
}
