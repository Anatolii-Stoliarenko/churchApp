import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { UtilsService } from '../../shared/services/utils.service';
import {
  CurrentUserInterface,
  LoginInterface,
  LoginResponse,
  RegisterInterface,
} from '../models/auth.model';
import { ApiService } from '../../shared/services/api.service';
import { PersistenceService } from '../../shared/services/persistence.service';
import { AppState } from '../../shared/store/appState.interface';
import * as authactions from '../store/auth.actions';
import { ApiResponse } from '../../reservation/models/reservations.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  utilsService = inject(UtilsService);
  api = inject(ApiService);
  router = inject(Router);
  persistenceService = inject(PersistenceService);
  store = inject(Store<AppState>);

  getCurrentUser(): CurrentUserInterface | null {
    return this.persistenceService.getItem<CurrentUserInterface>('currentUser');
  }

  restoreUser(): void {
    const currentUser = this.getCurrentUser();
    const token = this.persistenceService.getItem<string>('authToken');

    if (currentUser && token) {
      this.store.dispatch(
        authactions.loginSuccess({
          user: currentUser,
          token: token,
          message: '',
        })
      );
    }
  }

  logout(): void {
    const currentUser = this.getCurrentUser();
    if (currentUser)
      this.store.dispatch(
        authactions.logout({
          message: `${currentUser.name}`,
        })
      );
    return;
  }

  login(data: LoginInterface): Observable<LoginResponse> {
    return this.api.login(data);
  }

  registerEffect(data: RegisterInterface): Observable<ApiResponse> {
    return this.api.register(data);
  }

  // register(data: UserInterface): void {
  //   const user: UserInterface = {
  //     name: data.name,
  //     email: data.email,
  //     password: data.password,
  //   };
  //   this.api.register(user).subscribe({
  //     next: (response) => {
  //       this.utilsService.snackBarSuccess(`${response.message}`);
  //       this.utilsService.greenConsole(`${user.name} successfully registered`);
  //     },
  //     error: (error) => {
  //       console.error('Failed to register', error);
  //       this.utilsService.snackBarError('Failed to register');
  //     },
  //     complete: () => {
  //       this.router.navigate(['/login']);
  //     },
  //   });
  // }
}
