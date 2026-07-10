import axios from 'axios';
import { getMemberByWallet, getMembersByWallets, getMemberInfo } from '../../utils/helpers';
import { NotificationPartialData, WebNotification, NotificationContent } from '../../utils/types';
import {
  DefaultProviderChangedNotificationMetaData,
  ExecutePaymentNotificationMetaData,
  PaymentCompletedNotificationMetaData,
  PaymentCreatedNotificationMetaData,
  PaymentReceivedNotificationMetaData,
  ProviderAddedNotificationMetaData,
  rejectTxnNudgeNotificationMetaData,
} from './types';
import { generateJWT } from '../../../../lib/jwt';
import { NotificationFor, NewNotificationScope, NotificationStatus, NewNotificationType } from '../../utils/enums';

export class PaymentNotificationTemplateHandler {
  paymentCreatedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);
      if (to.for === NotificationFor.ADMIN) {
        const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const admins = result.data.data.admins;
        to.to = admins;

        //Captain info
      }

      const result = await axios.get(`${process.env.GATEWAY_URL}/api/payment/get/payment/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const paymentDetails = result.data.data.data[0];

      const receiver = await getMemberByWallet(paymentDetails.receiver, jwt);
      const sender = await getMemberInfo(from.from, jwt);

      const paymentCreatedNotificationMetaData: PaymentCreatedNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        payment_id: paymentDetails.payment_id,
        receiver: {
          username: receiver.username,
          name: receiver.name,
          member_id: receiver.member_id,
        },
        amount: paymentDetails.value[0].amount,
        currency: paymentDetails.value[0].currency.name,
        onReject: {
          status: 'rejected',
        },
        onApprove: {
          safeAddress: paymentDetails.sender,
          safeTxHash: paymentDetails.transaction_hash,
          provider: paymentDetails.payment_type,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `Payment Created for ${receiver.username}`,
        notificationBody: `Payment of ${paymentDetails.value[0].amount} ${paymentDetails?.value[0]?.currency.name} has been created for ${receiver.username}`,
        metaData: paymentCreatedNotificationMetaData,
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

  paymentCreatedContributorNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);

      const result = await axios.get(`${process.env.GATEWAY_URL}/api/payment/get/payment/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const paymentDetails = result.data.data.data[0];

      const daoData = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${paymentDetails.dao_id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const dao = daoData.data.data.dao;

      const receiver = await getMemberByWallet(paymentDetails.receiver, jwt);
      const sender = await getMemberInfo(from.from, jwt);

      const paymentCreatedNotificationMetaData: PaymentCreatedNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        payment_id: paymentDetails.payment_id,
        receiver: {
          username: receiver.username,
          name: receiver.name,
          member_id: receiver.member_id,
        },
        amount: paymentDetails.value[0].amount,
        currency: paymentDetails.value[0].currency.name,
        onReject: {
          status: 'rejected',
        },
        onApprove: {
          safeAddress: paymentDetails.sender,
          safeTxHash: paymentDetails.transaction_hash,
          provider: paymentDetails.payment_type,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `Payment Created for you`,
        notificationBody: `Payout created for you by ${dao.name} - Reward in on its way!`,
        metaData: paymentCreatedNotificationMetaData,
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

  paymentReceivedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(from.from);

      const receiver = await getMemberByWallet(to.to[0], jwt);

      to.to[0] = receiver.member_id;

      const result = await axios.get(`${process.env.GATEWAY_URL}/api/payment/get/payment/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const paymentDetails = result.data.data.data[0];

      const daoData = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${paymentDetails.dao_id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const dao = daoData.data.data.dao;

      const paymentReceivedNotificationMetaData: PaymentReceivedNotificationMetaData = {
        member: {
          member_id: dao.dao_id,
          username: dao.name,
          profile_picture: dao.profile_picture,
          name: dao.name,
        },
        payment_id: paymentDetails.payment_id,
        payment_tx_hash: paymentDetails.transaction_hash,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `Payment Received from ${dao.name}`,
        notificationBody: `Voila! You have received ${paymentDetails.value[0].amount} from ${dao.name}`,
        metaData: paymentReceivedNotificationMetaData,
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

  paymentCompletedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

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

      // const daoData = await axios.get(`${process.env.GATEWAY_URL}/api/dao/${paymentDetails.dao_id}`, {
      //   headers: {
      //     Authorization: `Bearer ${jwt}`,
      //   },
      // });
      //const dao = daoData.data.data;

      const result = await axios.get(`${process.env.GATEWAY_URL}/api/payment/get/payment/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const paymentDetails = result.data.data.data[0];

      const receiver = await getMemberByWallet(paymentDetails.receiver, jwt);

      const paymentCompletedNotificationMetaData: PaymentCompletedNotificationMetaData = {
        member: {
          member_id: receiver.member_id,
          username: receiver.username,
          profile_picture: receiver.profile_picture,
          name: receiver.name,
        },
        payment_id: paymentDetails.payment_id,
        payment_tx_hash: paymentDetails.transaction_hash,
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `Payment was completed for ${receiver.name}`,
        notificationBody: `Transaction completed successfully - Check your balance!`,
        metaData: paymentCompletedNotificationMetaData,
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

  providerAddedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
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

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const providerAddedNotificationMetaData: ProviderAddedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        provider_id: metaData?.id as string,
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: false,
        notificationHeader: `Payment provider added`,
        notificationBody: `New payment provider added - Review the options!`,
        metaData: providerAddedNotificationMetaData,
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

  defaultProviderChangedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
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

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const defaultProviderChangedNotificationMetaData: DefaultProviderChangedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        updated_provider_id: metaData?.id as string,
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: false,
        notificationHeader: `Payment provider added`,
        notificationBody: `Payment provider changed - Stay updated!`,
        metaData: defaultProviderChangedNotificationMetaData,
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

  firstSigningPaymentNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);

      const result = await axios.get(`${process.env.GATEWAY_URL}/api/payment/get/payment/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const paymentDetails = result.data.data.data[0];

      const receiver = await getMemberByWallet(paymentDetails.receiver, jwt);
      to.to = await getMembersByWallets(to.to, jwt);

      const sender = await getMemberInfo(from.from, jwt);

      const firstSigningNotificationMetaData: PaymentCreatedNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        payment_id: paymentDetails.payment_id,
        receiver: {
          username: receiver.username,
          name: receiver.name,
          member_id: receiver.member_id,
        },
        amount: paymentDetails.value[0].amount,
        currency: paymentDetails?.value[0]?.currency?.name,
        onReject: {
          status: 'rejected',
        },
        onApprove: {
          safeAddress: paymentDetails.sender,
          safeTxHash: paymentDetails.transaction_hash,
          provider: paymentDetails.payment_type,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: false,
        notificationHeader: `Payment provider added`,
        notificationBody: `New payment created - Sign now!`,
        metaData: firstSigningNotificationMetaData,
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

  signingPaymentNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);

      const result = await axios.get(`${process.env.GATEWAY_URL}/api/payment/get/payment/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const paymentDetails = result.data.data.data[0];

      to.to = await getMembersByWallets(to.to, jwt);

      const receiver = await getMemberByWallet(paymentDetails.receiver, jwt);
      const sender = await getMemberInfo(from.from, jwt);

      const signingNotificationMetaData: PaymentCreatedNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        payment_id: paymentDetails.payment_id,
        receiver: {
          username: receiver.username,
          name: receiver.name,
          member_id: receiver.member_id,
        },
        amount: paymentDetails.value[0].amount,
        currency: paymentDetails.value[0].currency.name,
        onReject: {
          status: 'rejected',
        },
        onApprove: {
          safeAddress: paymentDetails.sender,
          safeTxHash: paymentDetails.transaction_hash,
          provider: paymentDetails.payment_type,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `Payment provider added`,
        notificationBody: `Transaction requires your signature - Sign now!`,
        metaData: signingNotificationMetaData,
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

  executePaymentNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);

      to.to = await getMembersByWallets(to.to, jwt);

      const sender = await getMemberInfo(from.from, jwt);

      const executePaymentNotificationMetaData: ExecutePaymentNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: false,
        notificationHeader: `Payment provider added`,
        notificationBody: `Transaction signed by all parties - Let's proceed!`,
        metaData: executePaymentNotificationMetaData,
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

  initiatePayment = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
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

      const sender = await getMemberInfo(from.from, jwt);

      const initiatePaymentNotificationMetaData: ExecutePaymentNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `New payment added please intiate`,
        notificationBody: `New payment added please intiate`,
        metaData: initiatePaymentNotificationMetaData,
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

  rejectTxnNudgeNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);

      to.to = await getMembersByWallets(to.to, jwt);

      const sender = await getMemberInfo(from.from, jwt);

      const rejectTxnNudgeNotificationMetaData: rejectTxnNudgeNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        redirect_link: metaData?.redirect_link,
        safeTxHash: metaData?.extra?.safeTxHash as string,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `Payment provider added`,
        notificationBody: `${sender.name} reminds you to reject this transaction`,
        metaData: rejectTxnNudgeNotificationMetaData,
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

  acceptTxnNudgeNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const jwt = generateJWT(from.from);

      to.to = await getMembersByWallets(to.to, jwt);

      const sender = await getMemberInfo(from.from, jwt);

      const rejectTxnNudgeNotificationMetaData: rejectTxnNudgeNotificationMetaData = {
        member: {
          member_id: sender.member_id,
          username: sender.username,
          profile_picture: sender.profile_picture,
          name: sender.name,
        },
        redirect_link: metaData?.redirect_link,
        safeTxHash: metaData?.extra?.safeTxHash as string,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Payment'],
        popup: true,
        notificationHeader: `Payment provider added`,
        notificationBody: `${sender.name} reminds you to accept this transaction`,
        metaData: rejectTxnNudgeNotificationMetaData,
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
