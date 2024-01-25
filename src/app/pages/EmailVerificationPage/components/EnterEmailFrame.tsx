import { CancelOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { ErrorSnackbar } from 'app/components/Snackbar/ErrorSnackbar';
import { useState } from 'react';

export const EnterEmailFrame = (props: {
  setEmail: (email: string) => void;
}) => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('bits isnot match');
  const [inputEmail, setInputEmail] = useState('');
  const { setEmail } = props;

  return (
    <Grid
      item
      xs={6}
      height={'80vh'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ErrorSnackbar message={snackbarMessage} open={openSnackbar} />
      <Box
        my={6}
        p={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'white',
          borderRadius: '16px',
          p: 6,
        }}
      >
        <Typography variant="h5" color={'primary'} fontWeight={'bold'} mb={4}>
          Enter your email
        </Typography>
        <Typography
          variant="h6"
          color={'primary'}
          fontWeight={'bold'}
          textAlign={'center'}
        >
          We will send you a 6-digit code to verify your email
        </Typography>
        <Box sx={{ mt: 11 }}>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Your email
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              onChange={e => {
                setInputEmail(e.target.value);
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setInputEmail('');
                  }}
                >
                  <IconButton
                    aria-label="toggle password visibility"
                    edge="end"
                  >
                    <CancelOutlined />
                  </IconButton>
                </InputAdornment>
              }
              label="Your email"
            />
          </FormControl>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 11 }}
          onClick={async () => {
            setEmail(inputEmail);
          }}
        >
          Confirm
        </Button>
      </Box>
    </Grid>
  );
};
