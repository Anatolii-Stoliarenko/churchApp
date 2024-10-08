import { ActionReducerMap } from '@ngrx/store';
import { authReducer } from '../../auth/store/auth.reducer';

import { AppState } from './appState.interface';
import { AuthEffects } from '../../auth/store/auth.effects';
import { reservationReducer } from '../../reservation/store/reservations.reducers';
import { Reservationffects } from '../../reservation/store/reservations.effects';

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  reserv: reservationReducer,
};

export const effects = [AuthEffects, Reservationffects];
