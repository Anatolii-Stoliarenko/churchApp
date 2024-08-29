export type AuthMode = 'register' | 'login';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export interface User {
  id?: string;
  email: string;
  name?: string;
  role?: UserRole;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message: string;
}
