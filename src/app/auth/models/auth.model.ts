export type AuthMode = 'register' | 'login';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export interface UserInterface {
  id?: string;
  email: string;
  name?: string;
  role?: UserRole;
  password?: string;
}

export interface LoginInterface {
  email: string;
  password: string;
}

export interface RegisterInterface {
  name: string;
  email: string;
  password: string;
}

export interface CurrentUserInterface {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: CurrentUserInterface;
  message: string;
}
