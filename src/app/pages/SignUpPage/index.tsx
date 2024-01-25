import { Box, Container, Grid } from '@mui/material';
import { ImageFrame, RegisterForm } from './components';
export const SignUpPage = props => {
  return (
    <Container>
      <Box my={3}>
        <Box mt={3} mb={6}>
          <Grid container bgcolor={'#F3F2EF'}>
            <RegisterForm />
            <ImageFrame />
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
