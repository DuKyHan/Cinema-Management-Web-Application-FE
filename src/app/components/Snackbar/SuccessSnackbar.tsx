import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';
import { SyntheticEvent } from 'react';

export const SuccessSnackbar = (props: {
  message: string;
  open: boolean;
  onClose?:
    | ((
        event: Event | SyntheticEvent<any, Event>,
        reason?: SnackbarCloseReason,
      ) => void)
    | undefined;
}) => {
  const { message, open, onClose } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
