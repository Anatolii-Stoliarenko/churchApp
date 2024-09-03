import { createAction, props } from '@ngrx/store';

import {
  CurrentUserInterface,
  LoginInterface,
  RegisterInterface,
} from '../../models/auth.model';

export enum ActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login success',
  LOGIN_FAILURE = '[Auth] Login failure',

  LOGOUT = '[Auth] Logout',
  LOGOUT_SUCCESS = '[Auth] Logout Success',

  REGISTER = '[Auth] Register',
  REGISTER_SUCCESS = '[Auth] Register success',
  REGISTER_FAILURE = '[Auth] Register failure',
}

//Login
export const login = createAction(
  ActionTypes.LOGIN,
  props<{ payload: LoginInterface }>()
);

export const loginSuccess = createAction(
  ActionTypes.LOGIN_SUCCESS,
  props<{ user: CurrentUserInterface; token: string; message: string }>()
);

export const loginFailure = createAction(
  ActionTypes.LOGIN_FAILURE,
  props<{ error: string }>()
);

export const logout = createAction(
  ActionTypes.LOGOUT,
  props<{ message: string }>()
);

//Register
export const register = createAction(
  ActionTypes.REGISTER,
  props<{ payload: RegisterInterface }>()
);

export const registerSuccess = createAction(
  ActionTypes.REGISTER_SUCCESS,
  props<{ message: string }>()
);

export const registerFailure = createAction(
  ActionTypes.REGISTER_FAILURE,
  props<{ error: string }>()
);
