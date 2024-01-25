import { Home, NavigateNext } from '@mui/icons-material';
import { Breadcrumbs, Link } from '@mui/material';
import { AppRoute } from 'app/routes';

export const HomePageUserBreadcrumbs = () => {
  return (
    <Breadcrumbs
      separator={<NavigateNext fontSize="small" />}
      aria-label="breadcrumb"
    >
      <Link
        underline="hover"
        sx={{ display: 'flex', alignItems: 'center' }}
        color="inherit"
        href={AppRoute.Home}
      >
        <Home sx={{ mr: 0.5 }} fontSize="inherit" />
        Home
      </Link>
    </Breadcrumbs>
  );
};
