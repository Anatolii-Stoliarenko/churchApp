import { CurrentUserInterface } from '../models/auth.model';

export interface AuthState {
  user: CurrentUserInterface | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  message: null,
};
