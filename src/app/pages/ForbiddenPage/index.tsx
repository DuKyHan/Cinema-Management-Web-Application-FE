import { Box, Typography } from '@mui/material';
import { AppRoute } from 'app/routes';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const ForbiddenPage = () => {
  return (
    <>
      <Helmet>
        <title>403 Access Denied</title>
        <meta name="description" content="Access Denied" />
      </Helmet>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          gap: 1,
        }}
      >
        <Typography variant="h3" fontWeight={'bold'} textAlign={'center'}>
          4
          <span role="img" aria-label="Stop">
            ✋
          </span>
          3
        </Typography>
        <Typography textAlign={'center'}>Access Denied.</Typography>
        <Link to={AppRoute.Home}>Return to Home Page</Link>
      </Box>
    </>
  );
};
