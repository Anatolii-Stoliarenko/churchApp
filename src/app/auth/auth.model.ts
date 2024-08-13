import { UserRole } from './user-role.enum';

export type AuthMode = 'register' | 'login';

export interface AuthUserModel {
  id: string;
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

