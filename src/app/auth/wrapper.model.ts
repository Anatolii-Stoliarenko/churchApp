export type AuthMode = 'register' | 'login';

export interface AuthData {
  id: string;
  name: string;
  email: string;
  password: string;
}
