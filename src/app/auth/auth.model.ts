export type AuthMode = 'register' | 'login';

export interface AuthUserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}
