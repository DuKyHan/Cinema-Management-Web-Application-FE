import {
  Breakpoint,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
} from '@mui/material';

export const AppDialog = (props: {
  isDialogOpened: boolean;
  isDialogLoading?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: string;
  description?: string;
  content?: React.ReactNode;
  maxWidth?: Breakpoint | false;
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
}) => {
  const {
    isDialogOpened,
    isDialogLoading,
    onClose,
    onConfirm,
    title,
    description,
    content,
    fullWidth,
    disableBackdropClick,
  } = props;

  return (
    <Dialog
      open={isDialogOpened}
      onClose={(event, reason) => {
        if (disableBackdropClick && reason === 'backdropClick') {
          return;
        }
        onClose?.();
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={props.maxWidth}
      fullWidth={fullWidth}
    >
      <LinearProgress sx={{ opacity: isDialogLoading ? 100 : 0 }} />
      <DialogTitle id="alert-dialog-title">{title || 'Alert'}</DialogTitle>
      {content ? (
        content
      ) : (
        <>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {description || 'Confirm?'}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button disabled={isDialogLoading} onClick={onClose}>
              Cancel
            </Button>
            {onConfirm == null ? null : (
              <Button disabled={isDialogLoading} onClick={onConfirm}>
                Confirm
              </Button>
            )}
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};
