import { Alert, Snackbar, SnackbarCloseReason } from '@mui/material';
import { SyntheticEvent } from 'react';
import { SnackbarType } from 'types/snackbar-type';

export const AppSnackbar = (props: {
  message: string;
  open: boolean;
  onClose?:
    | ((
        event: Event | SyntheticEvent<any, Event>,
        reason?: SnackbarCloseReason,
      ) => void)
    | undefined;
  type: SnackbarType;
}) => {
  const { message, open, onClose, type } = props;

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
