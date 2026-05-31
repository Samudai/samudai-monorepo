import { IMember } from '../../utils/types';

export type CollabRequestNotificationMetaData = {
  member: IMember;
  from: {
    dao_name: string;
    dao_id: string;
  };
  to: {
    dao_name: string;
    dao_id: string;
  };
  onReject: {
    status: 'rejected';
    collaboration_id: string;
  };
  onAccept: {
    status: 'accepted';
    collaboration_id: string;
  };
  
};

export type CompleteProfileNotificationMetaData = {
  redirect_link?: string,
};
