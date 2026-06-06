import axios from 'axios';
import { getMemberByWallet, getMemberInfo } from '../../utils/helpers';
import { NotificationPartialData, WebNotification, NotificationContent } from '../../utils/types';
import { generateJWT } from '../../../../lib/jwt';
import {
  NewNotificationScope,
  NewNotificationType,
  NotificationFor,
  NotificationScope,
  NotificationStatus,
  NotificationType,
} from '../../utils/enums';
import {
  DiscussionCreatedNotificationMetaData,
  DiscussionInvitationNotificationMetaData,
  MostActiveParticipantToCreatorNotificationMetaData,
  MostLikedCommentNotificationMetaData,
  MostViewedDiscussionNotificationMetaData,
} from './types';
export class ForumNotificationTemplateHandler {
  discussionCreatedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);
      if (to.for === NotificationFor.ADMIN) {
        const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const admins = result.data.data.admins;
        to.to = admins;
      }

      const member = await getMemberInfo(from.from, jwt);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`);

      const discussionCreatedNotificationMetaData: DiscussionCreatedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `${member.username} has submitted a response to your deal form`,
        notificationBody: `${member.username} has submitted a response to a form`,
        metaData: discussionCreatedNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  invitedToDiscussion = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);

      const member = await getMemberInfo(from.from, jwt);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `${member.username} has invited you to a discussion`,
        notificationBody: `${member.username} has invited you to a discussion`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.MENTIONS,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  newProposalDiscussion = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);

      const member = await getMemberInfo(from.from, jwt);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `You're now part of the proposal discussion ${discussionResult.data.data.topic} - Check it out!`,
        notificationBody: `You're now part of the proposal discussion ${discussionResult.data.data.topic} - Check it out!`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  addedtoDiscussion = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);

      const member = await getMemberInfo(from.from, jwt);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `Added to forum discussion by ${member.name} - Join the convo!`,
        notificationBody: `Added to forum discussion by ${member.name} - Join the convo!`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.MENTIONS,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  memberJoined = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);

      const member = await getMemberInfo(from.from, jwt);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `New member ${member.name} joined ${discussionResult.data.data.topic} - Lets interact !`,
        notificationBody: `New member ${member.name} joined ${discussionResult.data.data.topic} - Lets interact !`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  memberLeft = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);

      const member = await getMemberInfo(from.from, jwt);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `${member.name} left ${discussionResult.data.data.topic}`,
        notificationBody: `${member.name} left ${discussionResult.data.data.topic}`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  commentAddedOnDiscussion = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);

      const member = await getMemberInfo(from.from, jwt);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `New comment added by ${member.name} - Join the discussion ${discussionResult.data.data.topic} !`,
        notificationBody: `New comment added by ${member.name} - Join the discussion ${discussionResult.data.data.topic} !`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  mostLikedComment = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const discussion_id = metaData?.id as string;
      const comment_id = metaData?.extra?.comment_id as string;

      const mostLikedCommentNotificationMetaData: MostLikedCommentNotificationMetaData = {
        discussion_id,
        comment_id,
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `Your comment is popular - Keep the conversation going! `,
        notificationBody: `Your comment is popular - Keep the conversation going! `,
        metaData: mostLikedCommentNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  mostViewedDiscussion = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(to.to[0]);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const mostViewedDiscussionNotificationMetaData: MostViewedDiscussionNotificationMetaData = {
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `Your discussion is trending - Keep it up!`,
        notificationBody: `Your discussion is trending - Keep it up!`,
        metaData: mostViewedDiscussionNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  mostActiveParticipant = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(to.to[0]);

      const participants = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/participant/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      to.to = participants.data.data.map((participant: any) => participant.member_id);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const mostViewedDiscussionNotificationMetaData: MostViewedDiscussionNotificationMetaData = {
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `Most active participant in discussion - Keep the engagement up!`,
        notificationBody: `Most active participant in discussion - Keep the engagement up!`,
        metaData: mostViewedDiscussionNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  mostActiveParticipantToCreator = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(to.to[0]);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const user = await getMemberInfo(from.from, jwt);

      const mostActiveParticipantToCreatorNotificationMetaData: MostActiveParticipantToCreatorNotificationMetaData = {
        member: {
          member_id: user.member_id,
          username: user.username,
          profile_picture: user.profile_picture,
          name: user.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `${user.name} is the most active in the discussion  `,
        notificationBody: `${user.name} is the most active in the discussion  `,
        metaData: mostActiveParticipantToCreatorNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  collectedCommentsNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(to.to[0]);

      const participants = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/participant/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      to.to = participants.data.data.map((participant: any) => participant.member_id);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const mostViewedDiscussionNotificationMetaData: MostViewedDiscussionNotificationMetaData = {
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `New comments in discussion name - Check them out!`,
        notificationBody: `New comments in discussion name - Check them out!`,
        metaData: mostViewedDiscussionNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  discussionClosedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);
      const member = await getMemberInfo(from.from, jwt);

      const participants = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/participant/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      to.to = participants.data.data.map((participant: any) => participant.member_id);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `${discussionResult.data.data.topic} closed by ${member.name} - Discussion over!`,
        notificationBody: `${discussionResult.data.data.topic} closed by ${member.name} - Discussion over!`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.ALL,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  commentReplyNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const messageRecievedNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Forum'],
        popup: true,
        notificationHeader: `${member.name} replied to your comment in ${discussionResult.data.data.topic}`,
        notificationBody: `${member.name} replied to your comment in ${discussionResult.data.data.topic}`,
        metaData: messageRecievedNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.MENTIONS,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  commentTaggedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const messageRecievedNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Forum'],
        popup: true,
        notificationHeader: `${member.name} mentioned you in ${discussionResult.data.data.topic}!`,
        notificationBody: `${member.name} mentioned you in ${discussionResult.data.data.topic}!`,
        metaData: messageRecievedNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.MENTIONS,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  allTaggedNotification = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);
      const member = await getMemberInfo(from.from, jwt);

      const participants = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/participant/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      to.to = participants.data.data.map((participant: any) => participant.member_id);

      const discussionResult = await axios.get(`${process.env.GATEWAY_URL}/api/discussion/get/${metaData?.id!}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const discussionInvitationNotificationMetaData: DiscussionInvitationNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        discussion: {
          discussion_id: discussionResult.data.data.discussion_id,
          title: discussionResult.data.data.topic,
          created_by: discussionResult.data.data.created_by,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Forum'],
        popup: false,
        notificationHeader: `${member.name} mentioned everyone in ${discussionResult.data.data.topic}`,
        notificationBody: `${member.name} mentioned everyone in ${discussionResult.data.data.topic}`,
        metaData: discussionInvitationNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.MENTIONS,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };
}
