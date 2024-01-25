import { useAuth } from 'app/context/AuthContext';
import { Role } from 'types/role';
import { NavBarMod } from './NarBarMod';
import { NavBarAdmin } from './NavBarAdmin';
import { NavBarUser } from './NavBarUser';

export function NavBar() {
  const { account } = useAuth();
  const role = account?.roles[0];

  if (role === Role.Admin) {
    return <NavBarAdmin />;
  } else if (role === Role.Moderator) {
    return <NavBarMod />;
  } else {
    return <NavBarUser />;
  }
}
