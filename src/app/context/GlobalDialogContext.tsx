import { Breakpoint } from '@mui/material';
import { AppDialog } from 'app/components/AppDialog';
import { createContext, useContext, useState } from 'react';

export const GlobalDialogContext = createContext<{
  isDialogOpened: boolean;
  isDialogLoading: boolean;
  showDialog: (props: {
    title?: string;
    description?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => void;
  showRawDialog: (props: {
    title?: string;
    content?: React.ReactNode;
    maxWidth?: Breakpoint | false;
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
  }) => void;
  closeDialog: () => void;
  setDialogLoading: (isLoading: boolean) => void;
}>({
  isDialogOpened: false,
  isDialogLoading: false,
  showDialog: () => {},
  showRawDialog: () => {},
  closeDialog: () => {},
  setDialogLoading: () => {},
});

export const GlobalDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isDialogOpened, setIsDialogOpened] = useState(false);
  const [isDialogLoading, setIsDialogLoading] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const [dialogContent, setDialogContent] = useState<React.ReactNode>(null);
  const [dialogOnConfirm, setDialogOnConfirm] = useState<
    (() => void | Promise<void>) | null
  >(null);
  const [dialogOnCancel, setDialogOnCancel] = useState<
    (() => void | Promise<void>) | null
  >(null);
  const [dialogMaxWidth, setDialogMaxWidth] = useState<Breakpoint | false>(
    false,
  );
  const [dialogFullWidth, setDialogFullWidth] = useState<boolean | undefined>(
    undefined,
  );
  const [disableBackdropClick, setDisableBackdropClick] = useState(false);

  const showDialog = (props: {
    title?: string;
    description?: string;
    content?: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
  }) => {
    const { title, description, content, onConfirm, onCancel } = props;

    setDialogTitle(title || '');
    setDialogDescription(description || '');
    setDialogContent(content || null);
    setDialogOnConfirm(onConfirm ? () => onConfirm : null);
    setDialogOnCancel(onCancel ? () => onCancel : null);
    setIsDialogOpened(true);
    setIsDialogLoading(false);
    setDialogMaxWidth(false);
    setDialogFullWidth(false);
    setDisableBackdropClick(false);
  };

  const showRawDialog = (props: {
    title?: string;
    content?: React.ReactNode;
    maxWidth: Breakpoint | false;
    fullWidth?: boolean;
    disableBackdropClick?: boolean;
  }) => {
    const { title, content, maxWidth, fullWidth, disableBackdropClick } = props;

    setDialogTitle(title ?? '');
    setDialogDescription('');
    setDialogContent(content || null);
    setDialogOnConfirm(null);
    setDialogOnCancel(null);
    setIsDialogOpened(true);
    setIsDialogLoading(false);
    setDialogMaxWidth(maxWidth);
    setDialogFullWidth(fullWidth);
    setDisableBackdropClick(disableBackdropClick ?? false);
  };

  const resetDialog = () => {
    setDialogTitle('');
    setDialogDescription('');
    setDialogContent(null);
    setDialogOnConfirm(null);
    setDialogOnCancel(null);
    setIsDialogOpened(false);
    setIsDialogLoading(false);
    setDialogMaxWidth(false);
    setDialogFullWidth(false);
    setDisableBackdropClick(false);
  };

  const closeDialog = () => {
    resetDialog();
  };

  return (
    <GlobalDialogContext.Provider
      value={{
        isDialogOpened: isDialogOpened,
        isDialogLoading: isDialogLoading,
        showDialog: showDialog,
        showRawDialog: showRawDialog,
        closeDialog: closeDialog,
        setDialogLoading: setIsDialogLoading,
      }}
    >
      <AppDialog
        isDialogOpened={isDialogOpened}
        isDialogLoading={isDialogLoading}
        onClose={async () => {
          await dialogOnCancel?.();
          resetDialog();
        }}
        maxWidth={dialogMaxWidth}
        fullWidth={dialogFullWidth}
        title={dialogTitle}
        description={dialogDescription}
        content={dialogContent}
        onConfirm={
          dialogOnConfirm == null
            ? undefined
            : async () => {
                await dialogOnConfirm?.();
                resetDialog();
              }
        }
        disableBackdropClick={disableBackdropClick}
      />
      {children}
    </GlobalDialogContext.Provider>
  );
};

export const useGlobalDialogContext = () => {
  return useContext(GlobalDialogContext);
};
