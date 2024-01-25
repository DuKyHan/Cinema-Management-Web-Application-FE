import { CancelOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgetPassword } from '../services/forgetpassword';
import { AppRoute } from 'app/routes';
import { ErrorSnackbar } from 'app/components/Snackbar/ErrorSnackbar';
export const ForgetPasswordFrame = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Register failed');
  const navigate = useNavigate();
  let success = true;
  const handleSubmit = () => {
    let errorTemp = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errorTemp = 'Please enter an email.';
      success = false;
    } else if (!emailRegex.test(email)) {
      errorTemp = 'Invalid email format.';
      success = false;
    }
    if (!success) {
      setError(errorTemp);
      return;
    }
    forgetPassword(email)
      .then(res => {
        navigate(AppRoute.EnterForgetPassword);
      })
      .catch(err => {
        setOpenSnackbar(true);
        setSnackbarMessage(err.response.data.error.details);
      });
  };
  return (
    <Grid
      item
      xs={7}
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
          Forget Password
        </Typography>
        <Typography
          variant="h6"
          color={'primary'}
          fontWeight={'bold'}
          sx={{ marginBottom: 4 }}
        ></Typography>
        <Typography
          sx={{ fontSize: '20' }}
          color={'primary'}
          fontWeight={'bold'}
          alignSelf={'start'}
          mt={14}
          ml={1}
        >
          Please enter your email
        </Typography>
        <Box>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Your email
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setEmail('');
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
              label="6-digit code"
            />
            {error ? (
              <FormHelperText sx={{ color: 'red' }}>{error}</FormHelperText>
            ) : (
              <FormHelperText>Type your email</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 20 }}
          onClick={handleSubmit}
        >
          Send recovery code
        </Button>
      </Box>
    </Grid>
  );
};
