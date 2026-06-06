import axios from 'axios';
import { getMemberByWallet, getMemberInfo } from '../../utils/helpers';
import { NotificationPartialData, WebNotification, NotificationContent } from '../../utils/types';
import { generateJWT } from '../../../../lib/jwt';
import {
  NotificationFor,
  NotificationScope,
  NotificationStatus,
  NotificationType,
  NewNotificationScope,
  NewNotificationType,
} from '../../utils/enums';
import {
  SocialConnectionRequestNotificationMetaData,
  ContributorCompleteProfileNotificationMetaData,
  ConnectionAcceptedNotificationMetaData,
} from './types';

export class ContributorNotificationTemplateHandler {
  socialConnectionRequestNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const SocialConnectionRequestNotificationMetaData: SocialConnectionRequestNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
          role: member.present_role,
        },
        from: {
          username: member.username,
          member_id: member.member_id,
        },
        onReject: {
          status: 'declined',
          request_id: metaData?.id!,
        },
        onApprove: {
          status: 'accepted',
          request_id: metaData?.id!,
        },
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.CONNECTION_REQUESTS,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `Alert! ${member.username} is eager to connect with you. Respond now!`,
        notificationBody: `Alert! ${member.username} is eager to connect with you. Respond now!`,
        metaData: SocialConnectionRequestNotificationMetaData,
      };

      const notification: WebNotification = {
        notificationId: `${from.from}-${to.to.length}-${timestamp}`,
        notificationData: notificationPartialData,
        notificationStatus: NotificationStatus.Pending,
        notificationContent: notificationContent,
        timestamp: Date.now(),
        scope: NewNotificationScope.CONNECTION_REQUESTS,
      };

      return notification;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  };

  connectionAcceptedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const ConnectionAcceptedNotificationMetaData: ConnectionAcceptedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `Congrats! ${member.username} has accepted your connection request. Say hello!`,
        notificationBody: `Congrats! ${member.username} has accepted your connection request. Say hello!`,
        metaData: ConnectionAcceptedNotificationMetaData,
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

  contributorCompleteProfileNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const ContributorCompleteProfileNotificationMetaData: ContributorCompleteProfileNotificationMetaData = {
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `Complete your profile and grab your PFP!`,
        notificationBody: `Complete your profile and grab your PFP - Customize your profile now!`,
        metaData: ContributorCompleteProfileNotificationMetaData,
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

  contributorCompleteProfileForJobNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const ContributorCompleteProfileNotificationMetaData: ContributorCompleteProfileNotificationMetaData = {
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `Please complete your profile to apply for the jobs`,
        notificationBody: `Please complete your profile to apply for the jobs`,
        metaData: ContributorCompleteProfileNotificationMetaData,
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

  contributorSubdomainClaimSuccessNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const ContributorSubdomainClaimSuccessNotificationMetaData: ContributorCompleteProfileNotificationMetaData = {
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `The subdomain you requested has been successfully created. Initial setup may take an hour; please expect temporary errors, and kindly retry for a while until it runs smoothly.`,
        notificationBody: `The subdomain you requested has been successfully created. Initial setup may take an hour; please expect temporary errors, and kindly retry for a while until it runs smoothly.`,
        metaData: ContributorSubdomainClaimSuccessNotificationMetaData,
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
}
