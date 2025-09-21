import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { UtilsService } from '../../shared/services/utils.service';
import { CurrentUserInterface, LoginInterface, LoginResponse, RegisterInterface } from '../models/auth.model';
import { AppState } from '../../shared/store/appState.interface';
import * as authactions from '../store/auth.actions';
import { ApiResponse } from '../../reservations/models/reservations.model';
import { ApiService } from '../../core/services/api.service';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { SessionStorageService } from '../../core/services/session-storage.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    utilsService = inject(UtilsService);
    apiService = inject(ApiService);
    router = inject(Router);
    store = inject(Store<AppState>);
    // private readonly _localStorageService = inject(LocalStorageService);
    private readonly _sessionStorageService = inject(SessionStorageService);

    getCurrentUser(): CurrentUserInterface | null {
        return this._sessionStorageService.getItem<CurrentUserInterface>('currentUser');
    }

    restoreUser(): void {
        const currentUser = this.getCurrentUser();
        const token = this._sessionStorageService.getItem<string>('authToken');

        if (currentUser && token) {
            this.store.dispatch(
                authactions.loginSuccess({
                    user: currentUser,
                    token: token,
                    message: '',
                }),
            );
        }
    }

    logout(): void {
        const currentUser = this.getCurrentUser();
        if (currentUser)
            this.store.dispatch(
                authactions.logout({
                    message: `${currentUser.name}`,
                }),
            );
        return;
    }

    register(user: RegisterInterface): Observable<ApiResponse> {
        return this.apiService.post<ApiResponse>('register', user);
    }

    login(payload: LoginInterface): Observable<LoginResponse> {
        return this.apiService.post<LoginResponse>('login', payload);
    }
}
