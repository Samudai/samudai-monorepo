import {
  NewNotificationScope,
  NewNotificationType,
  NotificationCreatedby,
  NotificationFor,
  NotificationScope,
  NotificationStatus,
  NotificationType,
} from './enums';

interface Extra {
  [key: string]: string | number;
}
export type MemberSession = {
  memberId: string;
  member: string;
  connected: boolean;
};

export type ErrorResponse = {
  message: string;
  error: string;
};

//Notification that is sent out
export type WebNotification = {
  notificationId: string;
  notificationData: NotificationPartialData;
  notificationStatus: NotificationStatus;
  notificationContent: NotificationContent;
  timestamp: number;
  scope: NotificationScope | NewNotificationScope;
  read?: boolean;
};

export type NotificationContent = {
  type: NotificationType | NewNotificationType;
  tags: string[];
  popup: boolean;
  notificationHeader: string;
  notificationBody: string;
  metaData?: any;
};

export type IMember = {
  member_id: string;
  username: string;
  profile_picture: string;
  name: string;
};

export type NotificationPartialData = {
  to: {
    to: string[];
    for: NotificationFor;
  };
  from: {
    from: string;
    origin?: string;
    by: NotificationCreatedby;
  };
  metaData?: {
    id: string;
    redirect_link?: string;
    extra?: Extra;
  };
  timestamp: string;
};

// General
