import { AppSnackbar } from 'app/components/Snackbar/AppSnackbar';
import { createContext, useContext, useState } from 'react';
import { SnackbarType } from 'types/snackbar-type';

export const GlobalSnackbarContext = createContext<{
  isSnackbarOpened: boolean;
  snackbarMessage: string;
  showSnackbar: (message: string, type?: SnackbarType | null) => void;
  showSuccessSnackbar: (message: string) => void;
  showWarningSnackbar: (message: string) => void;
  showErrorSnackbar: (message?: string) => void;
}>({
  isSnackbarOpened: false,
  snackbarMessage: '',
  showSnackbar: () => {},
  showSuccessSnackbar: () => {},
  showWarningSnackbar: () => {},
  showErrorSnackbar: () => {},
});

export const GlobalSnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isSnackbarOpened, setIsSnackbarOpened] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<SnackbarType>(
    SnackbarType.INFO,
  );

  const showSnackbar = (message: string, type?: SnackbarType | null) => {
    setSnackbarMessage(message);
    setIsSnackbarOpened(true);
    setSnackbarType(type || SnackbarType.INFO);
  };

  const showSuccessSnackbar = (message: string) => {
    showSnackbar(message, SnackbarType.SUCCESS);
  };

  const showWarningSnackbar = (message: string) => {
    showSnackbar(message, SnackbarType.WARNING);
  };

  const showErrorSnackbar = (message?: string) => {
    showSnackbar(
      message == null || message.length === 0
        ? 'An error has happened'
        : message,
      SnackbarType.ERROR,
    );
  };

  return (
    <GlobalSnackbarContext.Provider
      value={{
        isSnackbarOpened,
        snackbarMessage,
        showSnackbar,
        showSuccessSnackbar,
        showWarningSnackbar,
        showErrorSnackbar,
      }}
    >
      <AppSnackbar
        message={snackbarMessage}
        open={isSnackbarOpened}
        onClose={() => {
          setIsSnackbarOpened(false);
        }}
        type={snackbarType}
      />
      {children}
    </GlobalSnackbarContext.Provider>
  );
};

export const useGlobalSnackbar = () => {
  return useContext(GlobalSnackbarContext);
};
