import { PaginationQueryDto } from './query';

export enum NotificationType {
  System = 'system',
  Ticket = 'ticket',
  Report = 'report',
  Cinema = 'cinema',
  News = 'news',
  Other = 'other',
}

export const notificationTypes = Object.values(NotificationType);

export class Notification {
  id: number;

  accountId: number;

  from?: string;

  type: NotificationType;

  title: string;

  description: string;

  shortDescription?: string;

  read: boolean;

  pushOnly: boolean;

  createdAt?: Date;

  reportId?: number;
}

export enum GetNotificationSort {
  CreatedAtAsc = 'createdAt',
  CreatedAtDesc = '-createdAt',
}

export enum GetNotificationInclude {
  Data = 'data',
}

export class GetNotificationByIdQueryDto extends PaginationQueryDto {
  include?: GetNotificationInclude;
}

export class GetNotificationsQueryDto extends GetNotificationByIdQueryDto {
  id?: number[];

  name?: string;

  read?: boolean;

  type?: NotificationType[];

  sort?: GetNotificationSort[];

  accountId?: number[];
}

export class NotificationIdsInputDto {
  id: number[];
}
