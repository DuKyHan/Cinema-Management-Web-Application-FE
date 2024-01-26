import { Box, Container, Grid } from '@mui/material';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ForgetPasswordFrame } from './components';
import { EnterEmailFrame } from './components/EnterEmailFrame';
import { ImageFrame } from './components/ImageFrame';

export const ForgetPasswordPage = props => {
  const location = useLocation();
  const [email, setEmail] = useState(
    location.state == null ? null : (location.state as string),
  );

  return (
    <Container>
      <Box my={3}>
        <Box mt={3} mb={6}>
          <Grid container bgcolor={'#F3F2EF'}>
            <ImageFrame />
            {email == null ? (
              <EnterEmailFrame setEmail={setEmail} />
            ) : (
              <ForgetPasswordFrame email={email} />
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
