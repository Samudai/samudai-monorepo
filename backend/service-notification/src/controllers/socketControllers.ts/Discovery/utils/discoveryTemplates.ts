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
import { MostActiveNotificationMetaData, viewedProfileNotificationMetaData } from './types';

export class DiscoveryNotificationTemplateHandler {
  viewedProfileNotification = async (
    notificationPartialData: NotificationPartialData
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const viewedProfileNotificationMetaData: viewedProfileNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        viewer_id: member.member_id,
        viewed_member_id: to.to[0],
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Profile'],
        popup: false,
        notificationHeader: `Someone viewed your profile`,
        notificationBody: `${member.name} viewed your profile - Connect with them!`,
        metaData: viewedProfileNotificationMetaData,
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

  // mostActiveNotification = async (
  //     notificationPartialData: NotificationPartialData
  // ): Promise<WebNotification | null> => {
  // try{
  //     const { to, from, metaData, timestamp } = notificationPartialData;

  //     if(metaData?.extra?.link_type === 'dao'){
  //         const daoData = await axios.get(`${process.env.GATEWAY_URL}/api/dao/${metaData?.extra?.link_id}`, {
  //             headers: {
  //                 Authorization: `Bearer ${jwt}`,
  //             },
  //         });
  //         const dao = daoData.data.data;
  //     }

  //     const mostActiveNotificationMetaData : MostActiveNotificationMetaData = {
  //         most_active_type : metaData?.extra?.link_type as string,
  //         most_active_id : metaData?.extra?.link_id as string
  //     }

  //     const notificationContent: NotificationContent = {
  //         type: NotificationType.Heads_Up,
  //         notificationHeader: `Payment provider added`,
  //         notificationBody: ` Most active DAO on Samudai - Keep up the good work!`,
  //         metaData: mostActiveNotificationMetaData,
  //     };

  //     const notification: WebNotification = {
  //         notificationId: `${from.from}-${to.to.length}-${timestamp}`,
  //         notificationData: notificationPartialData,
  //         notificationStatus: NotificationStatus.Pending,
  //         notificationContent: notificationContent,
  //         timestamp: Date.now(),
  //         scope: NotificationScope.PAYMENT,
  //     };

  //     return notification;

  // } catch (err: any) {
  //     console.log(err);
  //     return null;
  // }
  // }
}
