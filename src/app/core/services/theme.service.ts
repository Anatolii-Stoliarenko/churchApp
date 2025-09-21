import { inject, Injectable, signal } from '@angular/core';

import { STORAGE_KEYS } from '../config/localstorage.config';
import { LocalStorageService } from './local-storage.service';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    private readonly _localStorageService = inject(LocalStorageService);

    private readonly _THEME_KEY = STORAGE_KEYS.THEME;
    private readonly _themeSignal = signal<'light' | 'dark'>('light');
    private readonly _isCheckedSystemMode = signal<boolean>(false);

    get theme() {
        return this._themeSignal();
    }

    constructor() {
        this.loadTheme();
    }

    togleSystemMode(): void {
        this._isCheckedSystemMode.update(val => !val);
    }

    setTheme(theme: 'light' | 'dark') {
        this._themeSignal.set(theme);
        this._localStorageService.setItem(this._THEME_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
    }

    loadTheme(): void {
        if (this._isCheckedSystemMode()) {
            this.loadSystemTheme();
        } else {
            this.loadManualTheme();
        }
    }

    private loadManualTheme() {
        const storedTheme = this._localStorageService.getItem(this._THEME_KEY) as 'light' | 'dark' | null;
        this.setTheme(storedTheme || this.getSystemTheme());
    }

    private loadSystemTheme() {
        const theme = this.getSystemTheme();
        document.documentElement.setAttribute('data-theme', theme);
        this._localStorageService.setItem(this._THEME_KEY, theme);
    }

    private getSystemTheme(): 'light' | 'dark' {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
}
