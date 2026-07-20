import { IMember } from '../../utils/types';

export type ChatRequestNotificationMetaData = {
  member: IMember;
  redirect_link?: string;
};

export type ChatRequestAcceptedNotificationMetaData = {
  member: IMember;
  redirect_link?: string;
};

export type MessageRecievedNotificationMetaData = {
  member: IMember;
  redirect_link?: string;
};
