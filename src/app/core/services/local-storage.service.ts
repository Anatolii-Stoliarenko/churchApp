import { inject, Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root',
})
export class LocalStorageService {
    private readonly _loggerService = inject(LoggerService);

    setItem<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                this._loggerService.error(`Brak miejsca w LocalStorage dla klucza: ${key}`, error);
            } else {
                this._loggerService.error(`Nie udało się zapisać do LocalStorage dla klucza: ${key}`, error);
            }
        }
    }

    getItem<T>(key: string): T | null {
        try {
            const serializedValue = localStorage.getItem(key);
            return serializedValue ? JSON.parse(serializedValue) : null;
        } catch (error) {
            this._loggerService.error(`Nie udało się odczytać danych z LocalStorage dla klucza: ${key}`, error);
            return null;
        }
    }

    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            this._loggerService.error(`Błąd usunięcia z LocalStorage dla klucza: ${key}`, error);
        }
    }

    clearLocalStorage(): void {
        try {
            localStorage.clear();
        } catch (error) {
            this._loggerService.error('Błąd podczas czyszczenia LocalStorage:', error);
        }
    }
}
