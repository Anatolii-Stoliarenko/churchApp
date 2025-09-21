import { createAction, props } from '@ngrx/store';

import {
  CreateReservationModel,
  FetchedReservationModel,
  updateReservationInterface,
} from '../models/reservations.model';

export enum ActionTypes {
  SELECTED_DAY = '[Reserve] Selected day',

  GET_RESERVATIONS = '[Reserve] Get reservations',
  GET_RESERVATIONS_SUCCESS = '[Reserve] Get reservations success',
  GET_RESERVATIONS_FAILURE = '[Reserve] Get reservations failure',

  UPDATE_RESERVATION = '[Reserve] Update reservation',
  UPDATE_RESERVATION_SUCCESS = '[Reserve] Update reservation success',
  UPDATE_RESERVATION_FAILURE = '[Reserve] Update reservation failure',

  DELETE_RESERVATION = '[Reserve] Delete reservation',
  DELETE_RESERVATION_SUCCESS = '[Reserve] Delete reservation success',
  DELETE_RESERVATION_FAILURE = '[Reserve] Delete reservation failure',

  ADD_RESERVATION = '[Reserve] Add new reservations',
  ADD_RESERVATIONS_SUCCESS = '[Reserve] Add new reservations success',
  ADD_RESERVATIONS_FAILURE = '[Reserve] Add new reservations failure',
}

//select day
export const selectedDay = createAction(
  ActionTypes.SELECTED_DAY,
  props<{ selectedDay: string }>()
);

//get reservation
export const getReservations = createAction(ActionTypes.GET_RESERVATIONS);

export const getReservationsSuccess = createAction(
  ActionTypes.GET_RESERVATIONS_SUCCESS,
  props<{ message: string; reservations: FetchedReservationModel[] }>()
);

export const getReservationsFailure = createAction(
  ActionTypes.GET_RESERVATIONS_FAILURE,
  props<{ error: string }>()
);

//add reservation
export const addReservations = createAction(
  ActionTypes.ADD_RESERVATION,
  props<{ reservation: CreateReservationModel }>()
);

export const addReservationsSuccess = createAction(
  ActionTypes.ADD_RESERVATIONS_SUCCESS,
  props<{ message: string }>()
);

export const addReservationsFailure = createAction(
  ActionTypes.ADD_RESERVATIONS_FAILURE,
  props<{ error: string }>()
);

//update reservation
export const updateReservations = createAction(
  ActionTypes.UPDATE_RESERVATION,
  props<{ id: string; payload: updateReservationInterface }>()
);

export const updateReservationsSuccess = createAction(
  ActionTypes.UPDATE_RESERVATION_SUCCESS,
  props<{ message: string }>()
);

export const updateReservationsFailure = createAction(
  ActionTypes.UPDATE_RESERVATION_FAILURE,
  props<{ error: string }>()
);

//delete reservation
export const deleteReservations = createAction(
  ActionTypes.DELETE_RESERVATION,
  props<{ id: string }>()
);

export const deleteReservationsSuccess = createAction(
  ActionTypes.DELETE_RESERVATION_SUCCESS,
  props<{ message: string }>()
);

export const deleteReservationsFailure = createAction(
  ActionTypes.DELETE_RESERVATION_FAILURE,
  props<{ error: string }>()
);
