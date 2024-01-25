import {
  GetNotificationByIdQueryDto,
  GetNotificationsQueryDto,
  NotificationIdsInputDto,
} from 'types/notification';
import { authAxiosInstance } from 'utils/axios';

export const getNotifications = (query?: GetNotificationsQueryDto) => {
  return authAxiosInstance.get('/notifications', {
    params: query,
  });
};

export const countNotifications = (query?: GetNotificationsQueryDto) => {
  return authAxiosInstance.get('/notifications/count', {
    params: query,
  });
};

export const getNotificationById = (
  id: number,
  query?: GetNotificationByIdQueryDto,
) => {
  return authAxiosInstance.get(`/notifications/${id}`, {
    params: query,
  });
};

export const markNotificationsAsRead = (input: NotificationIdsInputDto) => {
  return authAxiosInstance.put(`/notifications/mark-as-read`, input);
};

export const deleteNotifications = (input: NotificationIdsInputDto) => {
  return authAxiosInstance.delete(`/notifications/${input.id.join(',')}`);
};
