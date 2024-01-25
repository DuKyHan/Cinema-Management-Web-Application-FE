import { CancelOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from '@mui/material';
import { AppRoute } from 'app/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enterCodeForgetPassword } from '../services/entercodeforgetpassword';
export const RecoveryCodeFrame = () => {
  const [bits, setbits] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const email = 'example@gmail.com';
  const navigate = useNavigate();
  const handleSubmit = () => {
    if (!bits) {
      setError('Please enter an email.');
      return;
    }
    // forgetPassword(User.email)
    //   .then(res => {
    //     navigate(AppRoute.);
    //   })
    //   .catch(err => {
    //     setOpenSnackbar(true);
    //     console.log(err);
    //     setSnackbarMessage(err.response.data.error.details);
    //   });
  };
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
          Enter recovery code
        </Typography>
        <Typography variant="h6" color={'primary'} fontWeight={'bold'}>
          Enter 6-digit code sent to
        </Typography>
        <Typography
          variant="h6"
          color={'primary'}
          fontWeight={'bold'}
          sx={{ marginBottom: 4 }}
        >
          {email}
        </Typography>
        <Box sx={{ mt: 11 }}>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              6-digit code
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={bits}
              onChange={e => {
                setbits(e.target.value);
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setbits('');
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
              <FormHelperText>Type your bits</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              New password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setPassword('');
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
              <FormHelperText>Type your new password</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 11 }}
          onClick={handleSubmit}
        >
          Confirm
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 4 }}>
          <Typography>Dont receive the code?</Typography>
          <Button onClick={() => {}} sx={{ textTransform: 'normal' }}>
            Send again in 30s
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};
