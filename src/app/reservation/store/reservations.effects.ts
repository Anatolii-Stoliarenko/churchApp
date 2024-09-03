import { Injectable } from '@angular/core';

import { catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import * as ReservActions from './reservations.actions';
import { UtilsService } from '../../shared/services/utils.service';
import { ReservationService } from '../services/reservation.service';

@Injectable()
export class Reservationffects {
  constructor(
    private actions$: Actions,
    private reserveService: ReservationService,
    private utilsService: UtilsService
  ) {}

  //Get all reservations
  getReservations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservActions.getReservations),
      mergeMap(() =>
        this.reserveService.getReservations().pipe(
          map((response) => {
            return ReservActions.getReservationsSuccess({
              reservations: response.reservations,
              message: response.message,
            });
          }),
          catchError((error) =>
            of(ReservActions.getReservationsFailure({ error: error }))
          )
        )
      )
    )
  );

  // getReservationSuccess$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(ReservActions.getReservationsSuccess),
  //       tap((action) => {
  //         this.utilsService.greenConsole(`${action.message} `);
  //       })
  //     ),
  //   { dispatch: false }
  // );

  getReservationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservActions.getReservationsFailure),
        tap((action) => {
          console.error(`Failed to get reservation, ${action.error}`);
          this.utilsService.snackBarError(`${action.error}`);
        })
      ),
    { dispatch: false }
  );

  //Add new reservation
  addReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservActions.addReservations),
      mergeMap((action) =>
        this.reserveService.addReservation(action.reservation).pipe(
          map((response) => {
            return ReservActions.addReservationsSuccess({
              message: response.message,
            });
          }),
          catchError((error) =>
            of(ReservActions.addReservationsFailure({ error: error }))
          )
        )
      )
    )
  );

  addReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservActions.addReservationsSuccess),
      switchMap(() => [ReservActions.getReservations()])
    )
  );

  addReservationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservActions.addReservationsFailure),
        tap((action) => {
          console.error(`Failed to add reservation, ${action.error}`);
          this.utilsService.snackBarError(`${action.error}`);
        })
      ),
    { dispatch: false }
  );

  //Update new reservation
  updateReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservActions.updateReservations),
      mergeMap((action) =>
        this.reserveService.updateReservation(action.id, action.payload).pipe(
          map((response) => {
            return ReservActions.updateReservationsSuccess({
              message: response.message,
            });
          }),
          catchError((error) =>
            of(ReservActions.addReservationsFailure({ error: error }))
          )
        )
      )
    )
  );

  updateReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservActions.updateReservationsSuccess),
      switchMap(() => [ReservActions.getReservations()])
    )
  );

  updateReservationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservActions.updateReservationsFailure),
        tap((action) => {
          console.error(`Failed to update reservation, ${action.error}`);
          this.utilsService.snackBarError(`${action.error}`);
        })
      ),
    { dispatch: false }
  );

  //Delete reservation
  deleteReservation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservActions.deleteReservations),
      mergeMap((action) =>
        this.reserveService.deleteReservationStore(action.id).pipe(
          map((response) => {
            return ReservActions.deleteReservationsSuccess({
              message: response.message,
            });
          }),
          catchError((error) =>
            of(ReservActions.deleteReservationsFailure({ error: error }))
          )
        )
      )
    )
  );

  deleteReservationSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ReservActions.deleteReservationsSuccess),
      switchMap(() => [ReservActions.getReservations()])
    )
  );

  deleteReservationFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ReservActions.deleteReservationsFailure),
        tap((action) => {
          console.error(`Failed to delete reservation, ${action.error}`);
          this.utilsService.snackBarError(`${action.error}`);
        })
      ),
    { dispatch: false }
  );
}
