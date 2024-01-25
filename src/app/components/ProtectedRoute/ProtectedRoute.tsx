import { useAuth } from 'app/context/AuthContext';
import { ForbiddenPage } from 'app/pages/ForbiddenPage';
import { AppRoute } from 'app/routes';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Role } from 'types/role';

export const RequireAuthRoute = () => {
  const { accessToken } = useAuth();
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to={AppRoute.Login} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export const RequireRoleRoute = (props: { role: Role }) => {
  const { account } = useAuth();

  if (!account?.roles.includes(props.role)) {
    return <ForbiddenPage />;
  }

  return <Outlet />;
};
