import { Box, Button, Grid, Typography } from '@mui/material';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { resetPassword } from 'app/services/auth';
import { useEffect, useState } from 'react';
import { FormContainer, TextFieldElement } from 'react-hook-form-mui';
import { useNavigate } from 'react-router-dom';
import { requestResetPassword } from '../services/forgetpassword';

export const ForgetPasswordFrame = (props: { email: string }) => {
  const { email } = props;
  const [hasSent, setHasSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();

  const navigate = useNavigate();

  const handleSendVerificationToken = () => {
    requestResetPassword(email)
      .then(res => {
        showSuccessSnackbar('Code is sent!');
        setTimeLeft(30);
      })
      .catch(err => {
        console.log(err);
        showErrorSnackbar(err.response.data.error.details);
      });
  };

  useEffect(() => {
    if (timeLeft == null) {
      return;
    }
    if (timeLeft > 0) {
      setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else {
      setTimeLeft(null);
    }
  }, [timeLeft]);

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
          Reset your password
        </Typography>
        <Typography
          variant="h6"
          color={'primary'}
          fontWeight={'bold'}
          textAlign="center"
        >
          Enter 6-digit code sent to {email} and new password
        </Typography>

        <Box sx={{ mt: 2 }}>
          <FormContainer
            onSuccess={data => {
              resetPassword({
                token: data.token.toString(),
                email: email,
                password: data.password,
              })
                .then(res => {
                  showSuccessSnackbar('Password is reset!');
                  navigate('/login');
                })
                .catch(err => {
                  showErrorSnackbar(err.response.data.error.details);
                });
            }}
          >
            <TextFieldElement
              fullWidth
              name="token"
              type="number"
              label="6-digit code"
              required
              sx={{ my: 2 }}
              inputProps={{
                maxLength: 6,
                min: 0,
                max: 6,
              }}
              transform={{
                input: value => {
                  if (value == null || value === '') {
                    return null;
                  }
                  const v = value.toString().replace(/\D/g, '');
                  return parseInt(v.slice(0, 6));
                },
              }}
            />
            <TextFieldElement
              fullWidth
              name="password"
              type={'password'}
              label="New password"
              required
              sx={{ my: 2 }}
              validation={{
                validate: (value, formValues) => {
                  if (value === '') {
                    return 'Password is required';
                  }
                  if (value.length < 6) {
                    return 'Password must be at least 8 characters';
                  }
                  if (value !== formValues.repassword) {
                    return 'Passwords do not match';
                  }
                  return true;
                },
              }}
            />
            <TextFieldElement
              fullWidth
              type={'password'}
              name="repassword"
              label="Retype new password"
              required
              sx={{ my: 2 }}
            />
            <Button
              fullWidth
              disabled={timeLeft != null}
              variant="outlined"
              sx={{ mt: 6 }}
              onClick={async () => {
                handleSendVerificationToken();
              }}
            >
              Send OTP {timeLeft != null ? `(${timeLeft})` : null}
            </Button>
            <Button fullWidth type="submit" variant="contained" sx={{ mt: 1 }}>
              Confirm
            </Button>
          </FormContainer>

          {/* <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              6-digit code
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={bits}
              onChange={e => {
                const value = e.target.value.replace(/\D/g, '');
                const truncatedValue = value.slice(0, 6);
                setBits(truncatedValue);
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setBits('');
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
          </FormControl>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              New password
            </InputLabel>
            <FormHelperText error>{errorPassword}</FormHelperText>
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
              label="New password"
            />
          </FormControl>
          <FormControl fullWidth sx={{ my: 1 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Retype new password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              value={rePassword}
              onChange={e => {
                setRePassword(e.target.value);
              }}
              endAdornment={
                <InputAdornment
                  position="end"
                  onClick={() => {
                    setRePassword('');
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
              label="Retype new password"
            />
          </FormControl> */}
        </Box>
      </Box>
    </Grid>
  );
};
