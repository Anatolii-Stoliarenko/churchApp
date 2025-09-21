import { createReducer, on } from '@ngrx/store';

import { ReservationState, initialReserveState } from './reservation.state';
import * as ReservationActions from './reservations.actions';
import * as AuthActions from '../../auth/store/auth.actions';

export const reservationReducer = createReducer<ReservationState>(
  initialReserveState,

  //Logout
  on(AuthActions.logout, (state) => ({
    ...state,
    reservations: null,
    selectedDay: null,
    error: null,
    message: null,
  })),

  //Select Day
  on(ReservationActions.selectedDay, (state, { selectedDay }) => ({
    ...state,
    selectedDay,
  })),

  //Get Reservation
  on(ReservationActions.getReservations, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    ReservationActions.getReservationsSuccess,
    (state, { message, reservations }) => ({
      ...state,
      loading: false,
      reservations,
      message,
    })
  ),
  on(ReservationActions.getReservationsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  //Add Reservation
  on(ReservationActions.addReservations, (state) => ({
    ...state,
    updateReservationLoading: true,
  })),
  on(ReservationActions.addReservationsSuccess, (state, { message }) => ({
    ...state,
    updateReservationLoading: false,
    message,
  })),
  on(ReservationActions.getReservationsFailure, (state, { error }) => ({
    ...state,
    updateReservationLoading: false,
    error,
  })),

  //Update Reservation
  on(ReservationActions.updateReservations, (state) => ({
    ...state,
    updateReservationLoading: true,
  })),
  on(ReservationActions.updateReservationsSuccess, (state, { message }) => ({
    ...state,
    updateReservationLoading: false,
    message,
  })),
  on(ReservationActions.updateReservationsFailure, (state, { error }) => ({
    ...state,
    updateReservationLoading: false,
    error,
  })),

  //Delete Reservation
  on(ReservationActions.deleteReservations, (state) => ({
    ...state,
    updateReservationLoading: true,
  })),
  on(ReservationActions.deleteReservationsSuccess, (state, { message }) => ({
    ...state,
    updateReservationLoading: false,
    message,
  })),
  on(ReservationActions.deleteReservationsFailure, (state, { error }) => ({
    ...state,
    updateReservationLoading: false,
    error,
  }))
);
