import { Adb } from '@mui/icons-material';
import { Typography } from '@mui/material';
import { AppRoute } from 'app/routes';
import { Link } from 'react-router-dom';

export const NavItemHome = () => {
  return (
    <Link
      to={AppRoute.Home}
      style={{
        display: 'flex',
        alignItems: 'center',
        textDecoration: 'none',
        color: 'black',
      }}
    >
      <Adb sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        CINEMA WEB
      </Typography>
    </Link>
  );
};
