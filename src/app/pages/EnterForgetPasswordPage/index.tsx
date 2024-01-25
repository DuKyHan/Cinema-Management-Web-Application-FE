import { Box, Container, Grid } from '@mui/material';
import { ImageFrame } from './components/ImageFrame';
import { RecoveryCodeFrame } from './components/RecoveryCodeFrame';

export const EnterForgetPasswordPage = props => {
  return (
    <Container>
      <Box my={3}>
        <Box mt={3} mb={6}>
          <Grid container bgcolor={'#F3F2EF'}>
            <ImageFrame />
            <RecoveryCodeFrame />
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
