import { Box, Container, Grid } from '@mui/material';
import { useAuth } from 'app/context/AuthContext';
import { AppRoute } from 'app/routes';
import { Navigate } from 'react-router-dom';
import { ImageFrame } from './components/ImageFrame';
import { LoginFrame } from './components/LoginFrame';

export const Login = props => {
  const { accessToken } = useAuth();

  if (accessToken) {
    return <Navigate to={AppRoute.Home} />;
  }

  return (
    <Container>
      <Box my={3}>
        <Box mt={3} mb={6}>
          <Grid container bgcolor={'#F3F2EF'}>
            <ImageFrame />
            <LoginFrame />
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
