import { createReducer, on } from '@ngrx/store';

import { AuthState, initialAuthState } from '../auth.state';
import * as AuthActions from '../actions/auth.actions';

export const authReducer = createReducer<AuthState>(
  initialAuthState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { user, token, message }) => ({
    ...state,
    user,
    token,
    loading: false,
    message,
  })),
  on(AuthActions.loginFailure, (state) => ({
    ...state,
    loading: false,
    error: state.error,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    user: null,
    token: null,
    error: null,
  }))
);
