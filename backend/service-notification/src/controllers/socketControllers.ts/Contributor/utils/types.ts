import { IMember } from '../../utils/types';

export type SocialConnectionRequestNotificationMetaData = {
  member: {
    member_id: string;
    username: string;
    profile_picture: string;
    name: string;
    role: string;
  };
  from: {
    username: string;
    member_id: string;
  };
  onReject: {
    status: 'declined';
    request_id: string;
  };
  onApprove: {
    status: 'accepted';
    request_id: string;
  };
};

export type ConnectionAcceptedNotificationMetaData = {
  member: IMember;
};

export type ContributorCompleteProfileNotificationMetaData = {
  redirect_link?: string;
};
