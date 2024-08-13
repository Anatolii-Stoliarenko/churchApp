import { AuthUserModel } from '../auth/auth.model';
import { UserRole } from '../auth/user-role.enum';
import {
  AdminConfig,
  DefaultUserConfig as DefaultUserConfig,
  ModeratorConfig,
} from './users-config';

export const DefaultUsers: AuthUserModel[] = [
  {
    id: '1',
    name: AdminConfig.NAME,
    email: AdminConfig.EMAIL,
    password: AdminConfig.PASSWORD,
    role: UserRole.ADMIN,
  },
  {
    id: '2',
    name: ModeratorConfig.NAME,
    email: ModeratorConfig.EMAIL,
    password: ModeratorConfig.PASSWORD,
    role: UserRole.MODERATOR,
  },
  {
    id: '3',
    name: DefaultUserConfig.NAME,
    email: DefaultUserConfig.EMAIL,
    password: DefaultUserConfig.PASSWORD,
    role: UserRole.USER,
  },
];
