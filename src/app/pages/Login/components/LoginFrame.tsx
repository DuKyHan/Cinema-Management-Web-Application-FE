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
import { ErrorSnackbar } from 'app/components/Snackbar/ErrorSnackbar';
import { AuthContext } from 'app/context/AuthContext';
import { AppRoute } from 'app/routes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account } from 'types/account';
import { login } from '../services/auth';
export const LoginFrame = () => {
  const [User, setUser] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState({
    email: '',
    password: '',
  });
  useEffect(() => {
    const savedEmail = localStorage.getItem('email');
    const savedPassword = localStorage.getItem('password');
    const savedRememberMe = localStorage.getItem('rememberMe');
    if (savedRememberMe === 'false') {
      setUser({ email: savedEmail || '', password: savedPassword || '' });
      setRememberMe(true);
    }
  }, []);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('Login failed');

  const navigate = useNavigate();

  const handleSubmit = () => {
    let success = true;
    const errorTemp = {
      email: '',
      password: '',
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!User.email) {
      errorTemp.email = 'Please enter an email.';
      success = false;
    }
    if (!emailRegex.test(User.email)) {
      errorTemp.email = 'Invalid email format.';
      success = false;
    }
    if (!User.password) {
      errorTemp.password = 'Please enter an password.';
      success = false;
    }
    if (!success) {
      setError(errorTemp);
      return false;
    }
    return true;
  };
  return (
    <AuthContext.Consumer>
      {({ handleLogin }) => (
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
            <Typography
              variant="h5"
              color={'primary'}
              fontWeight={'bold'}
              mb={4}
            >
              Đăng nhập
            </Typography>
            <Box component={'form'}>
              <Box>
                <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
                  <InputLabel htmlFor="outlined-adornment-email">
                    Email
                  </InputLabel>
                  <OutlinedInput
                    value={User.email}
                    onChange={e => {
                      setUser({ ...User, email: e.target.value });
                    }}
                    id="outlined-adornment-email"
                    name="email"
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setUser({ ...User, email: '' });
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
                    name="password"
                    value={User.password}
                    type="password"
                    onChange={e => {
                      setUser({ ...User, password: e.target.value });
                    }}
                    endAdornment={
                      <InputAdornment
                        position="end"
                        onClick={() => {
                          setUser({ ...User, password: '' });
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  sx={{ my: 1 }}
                  onClick={() => {
                    navigate(AppRoute.ForgetPassword);
                  }}
                >
                  Forgot password?
                </Button>
              </Box>

              <ErrorSnackbar
                message={snackbarMessage}
                open={openSnackbar}
                onClose={() => {
                  setOpenSnackbar(false);
                }}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ my: 4 }}
                onClick={() => {
                  if (!handleSubmit()) {
                    return;
                  }
                  const res = login(User.email, User.password);
                  res
                    .then(response => {
                      const account: Account = response.data.data.account;
                      const token = response.data.data.token;
                      handleLogin(account, token);
                      //navigate(AppRoute.Home);
                    })
                    .catch(err => {
                      const errorDetails = err.response.data.error.details;
                      const errorMessages: string =
                        typeof errorDetails === 'string'
                          ? errorDetails
                          : 'Login failed';
                      setOpenSnackbar(true);
                      setSnackbarMessage(errorMessages);
                    });
                }}
              >
                Đăng nhập
              </Button>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
              <Typography>Bạn chưa có tài khoản</Typography>
              <Button
                onClick={() => {
                  navigate(AppRoute.SignUp);
                }}
              >
                Đăng ký
              </Button>
            </Box>
          </Box>
        </Grid>
      )}
    </AuthContext.Consumer>
  );
};
