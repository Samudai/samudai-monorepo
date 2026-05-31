import { type } from "os";
import { IMember } from "../../utils/types";

export type DiscussionCreatedNotificationMetaData = {
    member: IMember;
    discussion: {
      title: string;
      discussion_id: string;
      created_by: string;
    };
    redirect_link?: string;
  };
  
export type DiscussionInvitationNotificationMetaData = {
  member: IMember;
  discussion: {
    title: string;
    discussion_id: string;
    created_by: string;
  };
  redirect_link?: string;
};

export type MostViewedDiscussionNotificationMetaData = {
  discussion: {
    title: string;
    discussion_id: string;
    created_by: string;
  };
  redirect_link?: string;
}

export type MostActiveParticipantToCreatorNotificationMetaData = {
  member: IMember;
  discussion: {
    title: string;
    discussion_id: string;
    created_by: string;
  };
  redirect_link?: string;
}

export type MostLikedCommentNotificationMetaData = {
  discussion_id: string,
  comment_id: string
  redirect_link?: string;
}