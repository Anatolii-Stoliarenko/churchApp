import { ActionReducerMap } from '@ngrx/store';
import { authReducer } from '../../auth/store/auth.reducer';

import { AppState } from './appState.interface';
import { AuthEffects } from '../../auth/store/auth.effects';
import { reservationReducer } from '../../reservations/store/reservations.reducers';
import { Reservationffects } from '../../reservations/store/reservations.effects';

export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    reserv: reservationReducer,
};

export const effects = [AuthEffects, Reservationffects];
