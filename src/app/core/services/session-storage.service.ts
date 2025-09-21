import { inject, Injectable } from '@angular/core';

import { LoggerService } from './logger.service';

@Injectable({
    providedIn: 'root',
})
export class SessionStorageService {
    private readonly _loggerService = inject(LoggerService);

    setItem<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(key, serializedValue);
        } catch (error) {
            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                this._loggerService.error(`Brak miejsca w SessionStorage dla klucza: ${key}`, error);
            } else {
                this._loggerService.error(`Nie udało się zapisać do LocalStorage dla klucza: ${key}`, error);
            }
        }
    }

    getItem<T>(key: string): T | null {
        try {
            const serializedValue = sessionStorage.getItem(key);
            return serializedValue ? JSON.parse(serializedValue) : null;
        } catch (error) {
            this._loggerService.error(`Nie udało się odczytać danych z SessionStorage dla klucza: ${key}`, error);
            return null;
        }
    }

    removeItem(key: string): void {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            this._loggerService.error(`Błąd usunięcia z SessionStorage dla klucza: ${key}`, error);
        }
    }

    clearSessionStorage(): void {
        try {
            sessionStorage.clear();
        } catch (error) {
            this._loggerService.error('Błąd podczas czyszczenia SessionStorage:', error);
        }
    }
}
