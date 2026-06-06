import { publishTelegramNotification } from '../../telegramController';
import { WebNotification, NotificationPartialData, ErrorResponse } from '../utils/types';
import { DaoNotificationTemplateHandler } from './utils/daoTemplates';

export class DaoSockets {
  daoNotification = (io: any, socket: any, redisFunc: any) => {
    const daoNotificationTemplateHandler = new DaoNotificationTemplateHandler();

    socket.on('collaboration_request', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification

      const collaborationNotification: WebNotification | null =
        await daoNotificationTemplateHandler.daoCollaborationRequestNotification(notificationPartialData);

      if (collaborationNotification) {
        await redisFunc.publishNotification(collaborationNotification as WebNotification);

        await publishTelegramNotification(collaborationNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of collaborationNotification.notificationData.to.to) {
          io.to(member).emit('all', collaborationNotification);
        }
      } else {
        console.log('Collaboration Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', collaborationNotification);
      }
    });

    socket.on('complete_profile', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification

      const completeProfileNotification: WebNotification | null =
        await daoNotificationTemplateHandler.daoCompleteProfileNotification(notificationPartialData);

      if (completeProfileNotification) {
        await redisFunc.publishNotification(completeProfileNotification as WebNotification);

        await publishTelegramNotification(completeProfileNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of completeProfileNotification.notificationData.to.to) {
          io.to(member).emit('all', completeProfileNotification);
        }
      } else {
        console.log('Complete Profile Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', completeProfileNotification);
      }
    });

    socket.on('dao_subdomain_claimed_success', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const completeProfileNotification: WebNotification | null =
        await daoNotificationTemplateHandler.daoSubdomainClaimSuccessNotification(notificationPartialData);

      if (completeProfileNotification) {
        await redisFunc.publishNotification(completeProfileNotification as WebNotification);

        await publishTelegramNotification(completeProfileNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of completeProfileNotification.notificationData.to.to) {
          io.to(member).emit('all', completeProfileNotification);
        }
      } else {
        console.log('Complete Profile Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', completeProfileNotification);
      }
    });
  };
}
