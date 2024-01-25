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
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import { AppRoute } from 'app/routes';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  emailVerification,
  sendEmailVerificationToken,
} from '../services/emailVerification';

export const VerificationFrame = (props: { email: string }) => {
  const { email } = props;
  const [bits, setBits] = useState('');
  const [hasSent, setHasSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { showSuccessSnackbar, showErrorSnackbar } = useGlobalSnackbar();

  const navigate = useNavigate();

  const handleSubmit = () => {
    emailVerification(email, bits)
      .then(res => {
        showSuccessSnackbar('Your account is registered');
        navigate(AppRoute.Login);
      })
      .catch(err => {
        console.log(err);
        showErrorSnackbar(err.response.data.error.details);
      });
  };

  const handleSendVerificationToken = () => {
    sendEmailVerificationToken(email)
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
          Verify your email
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
        </Box>
        <Button
          fullWidth
          disabled={timeLeft != null}
          variant="outlined"
          sx={{ mt: 11 }}
          onClick={async () => {
            handleSendVerificationToken();
          }}
        >
          Send OTP {timeLeft != null ? `(${timeLeft})` : null}
        </Button>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 1 }}
          onClick={async () => {
            handleSubmit();
          }}
        >
          Confirm
        </Button>
      </Box>
    </Grid>
  );
};
