import { Box, Container, Grid } from '@mui/material';
import { ImageFrame } from './components/ImageFrame';
import { ForgetPasswordFrame } from './components/ForgetPasswordFrame';

export const ForgetPasswordPage = props => {
  return (
    <Container>
      <Box my={3}>
        <Box mt={3} mb={6}>
          <Grid container bgcolor={'#F3F2EF'}>
            <ImageFrame />
            <ForgetPasswordFrame />
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
