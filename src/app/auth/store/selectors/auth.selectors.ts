import { createSelector, createFeatureSelector } from '@ngrx/store';

import { AuthState } from '../auth.state';

// Select the auth feature state
export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Select the user
export const currentUserSelector = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

// Select the user name (for example)
export const selectAuthUserName = createSelector(
  selectAuthState,
  (state: AuthState) => state.user?.name
);

// Select the token
export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);

// Select the loading status
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

// Select the error message
export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);
