import {
  Delete,
  Newspaper,
  ReportProblem,
  Settings,
  Theaters,
} from '@mui/icons-material';
import ConfirmationNumber from '@mui/icons-material/ConfirmationNumber';
import {
  Button,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { Loading } from 'app/components/Loading/Loading';
import { useGlobalDialogContext } from 'app/context/GlobalDialogContext';
import { useGlobalSnackbar } from 'app/context/GlobalSnackbarContext';
import {
  deleteNotifications,
  getNotifications,
  markNotificationsAsRead,
} from 'app/services/notification';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Notification, NotificationType } from 'types/notification';

const NotificationIcons = {
  [NotificationType.System]: <Settings />,
  [NotificationType.Other]: <Settings />,
  [NotificationType.Cinema]: <Theaters />,
  [NotificationType.News]: <Newspaper />,
  [NotificationType.Report]: <ReportProblem />,
  [NotificationType.Ticket]: <ConfirmationNumber />,
};

export const NotificationPage = () => {
  const { showDialog, setDialogLoading } = useGlobalDialogContext();
  const { showErrorSnackbar } = useGlobalSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [selectedNotifications, setSelectedNotifications] = useState<number[]>(
    [],
  );

  const reloadNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getNotifications();
      const notifications = response.data.data;
      setNotifications(notifications);
    } catch (error) {
      showErrorSnackbar(error.response.data.error.details);
    }
    setIsLoading(false);
  }, [showErrorSnackbar]);

  useEffect(() => {
    reloadNotifications();
  }, [reloadNotifications]);

  const toggleSelect = (id: number) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(n => n !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const hasSelectedAll = selectedNotifications.length === notifications.length;
  const hasSelectedSome = selectedNotifications.length > 0;

  return (
    <>
      <Typography variant="h4">Notifications</Typography>
      <Stack direction="row" justifyContent={'space-between'} sx={{ mt: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={hasSelectedAll}
              onClick={() => {
                if (hasSelectedAll) {
                  setSelectedNotifications([]);
                } else {
                  setSelectedNotifications(notifications.map(n => n.id));
                }
              }}
            />
          }
          label="Select all"
        />
        <Stack direction="row" gap={2}>
          <Button
            variant="contained"
            disabled={!hasSelectedSome}
            onClick={() => {
              console.log(selectedNotifications.length);
              showDialog({
                title: 'Mark selected as read',
                description:
                  'Are you sure you want to mark all selected notifications as read?',
                onConfirm: async () => {
                  setDialogLoading(true);
                  setSelectedNotifications([]);
                  try {
                    await markNotificationsAsRead({
                      id: selectedNotifications,
                    });
                    reloadNotifications();
                  } catch (error) {
                    showErrorSnackbar(error.response.data.error.details);
                  }
                },
              });
            }}
          >
            Mark selected as read
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            disabled={!hasSelectedSome}
            onClick={() => {
              showDialog({
                title: 'Delete selected',
                description:
                  'Are you sure you want to delete all selected notifications?',
                onConfirm: async () => {
                  setDialogLoading(true);
                  setSelectedNotifications([]);
                  try {
                    await deleteNotifications({
                      id: selectedNotifications,
                    });
                    reloadNotifications();
                  } catch (error) {
                    showErrorSnackbar(error.response.data.error.details);
                  }
                },
              });
            }}
          >
            Delete selected
          </Button>
        </Stack>
      </Stack>
      <List>
        {notifications.map((notification, index) => {
          const isRead = notification.read;
          const fontWeight = isRead ? undefined : 'bold';
          return (
            <ListItem
              key={index}
              sx={{
                border: 1,
                borderColor: 'lightgray',
                borderRadius: '4px',
                my: 2,
              }}
              onClick={() => {
                toggleSelect(notification.id);
              }}
              secondaryAction={
                <Checkbox
                  checked={selectedNotifications.includes(notification.id)}
                  onClick={() => {
                    toggleSelect(notification.id);
                  }}
                />
              }
            >
              <ListItemIcon>
                {NotificationIcons[notification.type]}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography fontWeight={fontWeight}>
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <>
                    <Typography fontWeight={fontWeight}>
                      {dayjs(notification.createdAt).format('HH:mm DD/MM/YYYY')}
                    </Typography>
                    <Typography color="text.primary" fontWeight={fontWeight}>
                      {notification.description}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};
