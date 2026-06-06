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
import { CollabRequestNotificationMetaData, CompleteProfileNotificationMetaData } from './types';
export class DaoNotificationTemplateHandler {
  daoCollaborationRequestNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      const jwt = generateJWT(from.from);

      const dao_from = await axios.get(`${process.env.GATEWAY_URL}/api/dao/${from.from}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const dao_to = await axios.get(`${process.env.GATEWAY_URL}/api/dao/${to.to[0]}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const dao_from_data = dao_from.data.data;
      const dao_to_data = dao_to.data.data;

      const DaoCollaborationRequestNotificationMetaData: CollabRequestNotificationMetaData = {
        member: {
          member_id: dao_from_data.dao_id,
          username: dao_from_data.name,
          profile_picture: dao_from_data.profile_picture,
          name: dao_from_data.name,
        },
        from: {
          dao_name: dao_from_data.name,
          dao_id: dao_from_data.dao_id,
        },
        to: {
          dao_name: dao_to_data.name,
          dao_id: dao_to_data.dao_id,
        },
        onReject: {
          status: 'rejected',
          collaboration_id: metaData?.id!,
        },
        onAccept: {
          status: 'accepted',
          collaboration_id: metaData?.id!,
        },
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `${dao_from_data.name} has sent you a collaboration request`,
        notificationBody: `${dao_from_data.name} has sent you a collaboration request`,
        metaData: DaoCollaborationRequestNotificationMetaData,
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

  daoCompleteProfileNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const DaoCompleteProfileNotificationMetaData: CompleteProfileNotificationMetaData = {
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `Complete your profile and get higher visibility in the ecosystem`,
        notificationBody: `Complete your profile for better visibility - Be more visible in the ecosystem!`,
        metaData: DaoCompleteProfileNotificationMetaData,
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

  daoSubdomainClaimSuccessNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      const member = await getMemberInfo(from.from, jwt);

      const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${to.to[0]}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const daoDetails = daoresult.data.data.dao;

      if (to.for === NotificationFor.ADMIN) {
        const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const admins = result.data.data.admins;
        to.to = admins;
      }

      const DaoSubdomainClaimSuccessNotificationMetaData: CompleteProfileNotificationMetaData = {
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: true,
        notificationHeader: `The subdomain for ${daoDetails.name} requested by ${member.username} has been successfully created. Initial setup may take an hour; please expect temporary errors, and kindly retry for a while until it runs smoothly.`,
        notificationBody: `The subdomain for ${daoDetails.name} requested by ${member.username} has been successfully created. Initial setup may take an hour; please expect temporary errors, and kindly retry for a while until it runs smoothly.`,
        metaData: DaoSubdomainClaimSuccessNotificationMetaData,
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
