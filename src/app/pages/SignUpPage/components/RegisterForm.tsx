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
import { ErrorSnackbar } from 'app/components/Snackbar/ErrorSnackbar';
import { AppRoute } from 'app/routes';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/signup';

export const RegisterForm = props => {
  const navigate = useNavigate();
  const [registerUser, setRegisterUser] = useState({
    email: '',
    password: '',
    repassword: '',
  });
  const [error, setError] = useState({
    email: '',
    password: '',
    repassword: '',
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Register failed');

  const handleSubmit = () => {
    let success = true;
    let errorTemp = {
      email: '',
      password: '',
      repassword: '',
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!registerUser.email) {
      errorTemp.email = 'Please enter an email.';
      success = false;
    } else if (!emailRegex.test(registerUser.email)) {
      errorTemp.email = 'Invalid email format.';
      success = false;
    }
    if (!registerUser.password) {
      errorTemp.password = 'Please enter an password.';
      success = false;
    }
    if (!(registerUser.password == registerUser.repassword)) {
      errorTemp.repassword = 'The password does not match';
      success = false;
    }
    if (!success) {
      setError(errorTemp);
      return;
    }
    signup(registerUser.email, registerUser.password)
      .then(res => {
        navigate(AppRoute.EmailVerification, {
          state: registerUser.email,
        });
      })
      .catch(err => {
        setOpenSnackbar(true);
        console.log(err);
        setSnackbarMessage(err.response.data.error.details);
      });
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
          Đăng ký
        </Typography>
        <Box>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={registerUser.email}
              onChange={e => {
                setRegisterUser({ ...registerUser, email: e.target.value });
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setRegisterUser({ ...registerUser, email: '' });
                    }}
                    edge="end"
                  >
                    <CancelOutlined />
                  </IconButton>
                </InputAdornment>
              }
              label="Email"
            />
            {error.email ? (
              <FormHelperText sx={{ color: 'red' }}>
                {error.email}
              </FormHelperText>
            ) : (
              <FormHelperText>Type your email</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type="password"
              value={registerUser.password}
              onChange={e => {
                setRegisterUser({ ...registerUser, password: e.target.value });
              }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setRegisterUser({ ...registerUser, password: '' });
                    }}
                    edge="end"
                  >
                    <CancelOutlined />
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {error.password ? (
              <FormHelperText sx={{ color: 'red' }}>
                {error.password}
              </FormHelperText>
            ) : (
              <FormHelperText>Type your password</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Retype Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type="password"
              value={registerUser.repassword}
              onChange={e => {
                setRegisterUser({
                  ...registerUser,
                  repassword: e.target.value,
                });
              }}
              //type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      setRegisterUser({ ...registerUser, repassword: '' });
                    }}
                    // onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    <CancelOutlined />
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {error.repassword ? (
              <FormHelperText sx={{ color: 'red' }}>
                {error.repassword}
              </FormHelperText>
            ) : (
              <FormHelperText>Type your repassword</FormHelperText>
            )}
          </FormControl>
        </Box>

        <Button
          variant="contained"
          sx={{
            my: 4,
            borderRadius: '15px',
            pl: 4,
            pr: 4,
            textTransform: 'none',
          }}
          onClick={handleSubmit}
        >
          Tạo tài khoản
        </Button>
      </Box>
    </Grid>
  );
};
