import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { AuthService } from '../../services/auth.service';
import * as AuthActions from '../actions/auth.actions';
import { UtilsService } from '../../../shared/services/utils.service';
import { PersistenceService } from '../../../shared/services/persistence.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private utilsService: UtilsService,
    private persistenceService: PersistenceService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.payload).pipe(
          map((response) => {
            this.persistenceService.saveItem('currentUser', response.user);
            this.persistenceService.saveItem('authToken', response.token);
            return AuthActions.loginSuccess({
              user: response.user,
              token: response.token,
              message: response.message,
            });
          }),
          catchError((error) => of(AuthActions.loginFailure({ error: error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          const message = `${action.user.name} successfully logged in`;
          action.message ? this.utilsService.snackBarSuccess(message) : '';
          this.router.navigate(['/reservation']);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap((action) => {
          console.error('Failed to login', action.error);
          this.utilsService.snackBarError('Failed to login');
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap((action) => {
          this.persistenceService.removeItem('currentUser');
          this.persistenceService.removeItem('authToken');
          this.utilsService.snackBarSuccess(
            `${action.message} successfully logged out`
          );
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );

  //   Register
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      mergeMap((action) =>
        this.authService.registerEffect(action.payload).pipe(
          map((response) => {
            return AuthActions.registerSuccess({
              message: response.message,
            });
          }),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error }))
          )
        )
      )
    )
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap((action) => {
          const message = `${action.message}`;
          action.message ? this.utilsService.snackBarSuccess(message) : '';
          this.utilsService.greenConsole(message);
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}
