import { IMember } from '../../utils/types';

export type GenenralNotificationMetaData = {
  member: IMember;
  redirect_link?: string;
};

export type MeetingCreatedNotificationMetaData = {
  member: IMember;
  meeting: {
    title?: string;
    location: string;
    meeting_id: string;
    date: string;
    from: string;
    to: string;
  };
  onView: {
    meeting_link: string;
  };
  redirect_link?: string;
};

export type DealFormResponseNotificationMetaData = {
  member: IMember;
  response: {
    project_id: string;
    title?: string;
    form_id: string;
    added_by: string;
  };
  onView: {
    form_id: string;
    project_id: string;
    dao_id: string;
  };
  redirect_link?: string;
};
