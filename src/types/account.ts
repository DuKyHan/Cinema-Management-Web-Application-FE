import { Role } from './role';

export class Account {
  id: number;
  email: string;
  isAccountVerified: boolean;
  isAccountDisabled: boolean;
  isEmailVerified: boolean;
  roles: Role[];
}
