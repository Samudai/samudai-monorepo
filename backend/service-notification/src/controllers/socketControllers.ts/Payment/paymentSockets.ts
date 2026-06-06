import { PaymentNotificationTemplateHandler } from './utils/paymentTemplates';
import { WebNotification, NotificationPartialData, ErrorResponse } from '../utils/types';
import { publishTelegramNotification } from '../../telegramController';

export class PaymentSockets {
  paymentNotifications = (io: any, socket: any, redisFunc: any) => {
    const paymentNotificationTemplateHandler = new PaymentNotificationTemplateHandler();

    socket.on('payment_created_notification', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification

      const paymentNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.paymentCreatedNotification(notificationPartialData);

      if (paymentNotification) {
        await redisFunc.publishNotification(paymentNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of paymentNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentNotification);
      }
    });

    socket.on(
      'payment_created_to_contributor_notification',
      async (notificationPartialData: NotificationPartialData) => {
        //Generate the notification

        const paymentNotification: WebNotification | null =
          await paymentNotificationTemplateHandler.paymentCreatedContributorNotification(notificationPartialData);

        if (paymentNotification) {
          await redisFunc.publishNotification(paymentNotification as WebNotification);
          //Check if user exists in the session and later emit notification
          for (const member of paymentNotification.notificationData.to.to) {
            io.to(member).emit('all', paymentNotification);
          }
        } else {
          console.log('Payment Notification not generated');
          io.to(notificationPartialData.from.from).emit('all', paymentNotification);
        }
      },
    );

    socket.on('contributor_payment_received', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const paymentNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.paymentReceivedNotification(notificationPartialData);

      if (paymentNotification) {
        await redisFunc.publishNotification(paymentNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of paymentNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentNotification);
      }
    });

    socket.on('payment_completed_notification', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const paymentNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.paymentCompletedNotification(notificationPartialData);

      if (paymentNotification) {
        await redisFunc.publishNotification(paymentNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of paymentNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentNotification);
      }
    });

    socket.on('provider_added', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const providerNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.providerAddedNotification(notificationPartialData);

      if (providerNotification) {
        await redisFunc.publishNotification(providerNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of providerNotification.notificationData.to.to) {
          io.to(member).emit('all', providerNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', providerNotification);
      }
    });

    socket.on('default_provider_changed', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const providerNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.defaultProviderChangedNotification(notificationPartialData);

      if (providerNotification) {
        await redisFunc.publishNotification(providerNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of providerNotification.notificationData.to.to) {
          io.to(member).emit('all', providerNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', providerNotification);
      }
    });

    socket.on('first_signing_payment', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const paymentSigningNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.firstSigningPaymentNotification(notificationPartialData);

      if (paymentSigningNotification) {
        await redisFunc.publishNotification(paymentSigningNotification as WebNotification);

        await publishTelegramNotification(paymentSigningNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of paymentSigningNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentSigningNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentSigningNotification);
      }
    });

    socket.on('signing_payment', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const paymentSigningNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.signingPaymentNotification(notificationPartialData);

      if (paymentSigningNotification) {
        await redisFunc.publishNotification(paymentSigningNotification as WebNotification);

        await publishTelegramNotification(paymentSigningNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of paymentSigningNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentSigningNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentSigningNotification);
      }
    });

    socket.on('execute_payment', async (notificationPartialData: NotificationPartialData) => {
      const paymentSigningNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.executePaymentNotification(notificationPartialData);

      if (paymentSigningNotification) {
        await redisFunc.publishNotification(paymentSigningNotification as WebNotification);

        await publishTelegramNotification(paymentSigningNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of paymentSigningNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentSigningNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentSigningNotification);
      }
    });

    socket.on('initiate_payment', async (notificationPartialData: NotificationPartialData) => {
      const paymentSigningNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.initiatePayment(notificationPartialData);

      if (paymentSigningNotification) {
        await redisFunc.publishNotification(paymentSigningNotification as WebNotification);

        await publishTelegramNotification(paymentSigningNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of paymentSigningNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentSigningNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentSigningNotification);
      }
    });

    socket.on('reject_txn_nudge', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const paymentSigningNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.rejectTxnNudgeNotification(notificationPartialData);

      if (paymentSigningNotification) {
        await redisFunc.publishNotification(paymentSigningNotification as WebNotification);

        await publishTelegramNotification(paymentSigningNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of paymentSigningNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentSigningNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentSigningNotification);
      }
    });

    socket.on('accept_txn_nudge', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const paymentSigningNotification: WebNotification | null =
        await paymentNotificationTemplateHandler.acceptTxnNudgeNotification(notificationPartialData);

      if (paymentSigningNotification) {
        await redisFunc.publishNotification(paymentSigningNotification as WebNotification);

        await publishTelegramNotification(paymentSigningNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of paymentSigningNotification.notificationData.to.to) {
          io.to(member).emit('all', paymentSigningNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', paymentSigningNotification);
      }
    });
  };
}
