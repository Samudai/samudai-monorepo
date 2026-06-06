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
  ChatRequestAcceptedNotificationMetaData,
  ChatRequestNotificationMetaData,
  MessageRecievedNotificationMetaData,
} from './types';

export class ChatNotificationTemplateHandler {
  chatRequestNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const chatRequestNotificationMetaData: ChatRequestNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Chat'],
        popup: false,
        notificationHeader: `Hey! ${member.name} sent you a chat request`,
        notificationBody: `Hey! ${member.name} sent you a chat request`,
        metaData: chatRequestNotificationMetaData,
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

  chatRequestAcceptedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const chatRequestAcceptedNotificationMetaData: ChatRequestAcceptedNotificationMetaData = {
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
        tags: ['Chat'],
        popup: false,
        notificationHeader: `Hey! ${member.name} accepted your chat request`,
        notificationBody: `Hey! ${member.name} accepted your chat request`,
        metaData: chatRequestAcceptedNotificationMetaData,
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

  messageRecievedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const messageRecievedNotificationMetaData: MessageRecievedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Chat'],
        popup: false,
        notificationHeader: `${member.name} sent you a message`,
        notificationBody: `${member.name} sent you a message`,
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

  groupMessageRecievedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const messageRecievedNotificationMetaData: MessageRecievedNotificationMetaData = {
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
        tags: ['Chat'],
        popup: false,
        notificationHeader: `${member.name} sent a message in ${metaData?.extra?.channelName}`,
        notificationBody: `${member.name} sent a message in ${metaData?.extra?.channelName}`,
        metaData: messageRecievedNotificationMetaData,
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

  groupJoiningRequestNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const messageRecievedNotificationMetaData: MessageRecievedNotificationMetaData = {
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
        tags: ['Chat'],
        popup: false,
        notificationHeader: `${member.name} requested to join the ${metaData?.extra?.chatRoom} chat room`,
        notificationBody: `${member.name} requested to join the ${metaData?.extra?.chatRoom} chat room`,
        metaData: messageRecievedNotificationMetaData,
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

  groupJoiningRequestAcceptedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const messageRecievedNotificationMetaData: MessageRecievedNotificationMetaData = {
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
        tags: ['Chat'],
        popup: false,
        notificationHeader: `Your request to join ${metaData?.extra?.chatRoom} has been accepted!`,
        notificationBody: `Your request to join ${metaData?.extra?.chatRoom} has been accepted!`,
        metaData: messageRecievedNotificationMetaData,
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
