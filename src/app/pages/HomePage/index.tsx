import { useAuth } from 'app/context/AuthContext';
import { Role } from 'types/role';
import { HomePageAdmin } from './components/HomePageAdmin';
import { HomePageMod } from './components/HomePageMod';
import { HomePageUser } from './components/HomePageUser';

export function HomePage() {
  const { account } = useAuth();

  const role = account?.roles[0] ?? Role.User;

  if (role === Role.Admin) {
    return <HomePageAdmin />;
  } else if (role === Role.Moderator) {
    return <HomePageMod />;
  } else {
    return <HomePageUser />;
  }
}
