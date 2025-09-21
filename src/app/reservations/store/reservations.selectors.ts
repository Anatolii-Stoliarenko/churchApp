import { createSelector, createFeatureSelector } from '@ngrx/store';

import { ReservationState } from './reservation.state';

export const selectReservationsState =
  createFeatureSelector<ReservationState>('reserv');

export const selectedDaySelector = createSelector(
  selectReservationsState,
  (state: ReservationState) => state.selectedDay
);

export const reservationsSelector = createSelector(
  selectReservationsState,
  (state: ReservationState) => state.reservations
);

export const loadingReservationsSelector = createSelector(
  selectReservationsState,
  (state: ReservationState) => state.loading
);

export const loadingUpdateReservationsSelector = createSelector(
  selectReservationsState,
  (state: ReservationState) => state.updateReservationLoading
);
