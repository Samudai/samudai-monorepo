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
  MeetingCreatedNotificationMetaData,
  GenenralNotificationMetaData,
  DealFormResponseNotificationMetaData,
} from './types';
export class GeneralNotificationTemplateHandler {
  meetingCreatedNotification = async (
    notificationPartialData: NotificationPartialData
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(from.from);

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const MeetingCreatedNotificationMetaData: MeetingCreatedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        meeting: {
          title: from.origin,
          meeting_id: metaData?.id!,
          location: metaData?.extra?.location as string,
          date: metaData?.extra?.date as string,
          from: metaData?.extra?.from as string,
          to: metaData?.extra?.to as string,
        },
        onView: {
          meeting_link: metaData?.extra?.meeting_link as string,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: [],
        popup: false,
        notificationHeader: `${member.username} has created an upcoming meeting`,
        notificationBody: `${member.username} has created a meeting for ${from.origin}`,
        metaData: MeetingCreatedNotificationMetaData,
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

  generalInformationNotification = async (
    notificationPartialData: NotificationPartialData
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
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

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const GenenralNotificationMetaData: GenenralNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: [],
        popup: false,
        notificationHeader: metaData?.extra?.header as string,
        notificationBody: metaData?.extra?.body as string,
        metaData: GenenralNotificationMetaData,
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

  dealFormResponseNotification = async (
    notificationPartialData: NotificationPartialData
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      // const memberResult = await getMemberInfo(from.from);
      // const member = memberResult;
      const jwt = generateJWT(from.from);
      const dao_id = to.to[0];
      const investment = await axios.get(`${process.env.GATEWAY_URL}/api/project/get/investment/${to.to[0]}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const projectId: string = investment.data.data.project_id;

      if (to.for === NotificationFor.ADMIN) {
        const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const admins = result.data.data.admins;
        to.to = admins;
      }

      // const memberResult = await getMemberByWallet(from.from, jwt);
      // const member = memberResult;

      const DealFormResponseNotificationMetaData: DealFormResponseNotificationMetaData = {
        member: {
          member_id: '',
          username: 'form',
          profile_picture: '',
          name: 'Form Response',
        },
        response: {
          title: from.origin,
          form_id: metaData?.id!,
          added_by: from.from,
          project_id: projectId,
        },
        onView: {
          form_id: projectId,
          project_id: projectId,
          dao_id: dao_id,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: [],
        popup: false,
        notificationHeader: `${from.from} has submitted a response to your deal form`,
        notificationBody: `${from.from} has submitted a response to a form`,
        metaData: DealFormResponseNotificationMetaData,
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
      console.log(err.response.data);
      return null;
    }
  };
}
