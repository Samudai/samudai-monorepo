import { WebNotification, NotificationPartialData, ErrorResponse } from '../utils/types';
import { ContributorNotificationTemplateHandler } from './utils/contributorTemplates';
import { publishTelegramNotification } from '../../telegramController';

export class ContributorSockets {
  contributorNotifications = (io: any, socket: any, redisFunc: any) => {
    const contributorNotificationTemplateHandler = new ContributorNotificationTemplateHandler();

    socket.on('social_connection_request', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const socialConnectionNotification: WebNotification | null =
        await contributorNotificationTemplateHandler.socialConnectionRequestNotification(notificationPartialData);

      if (socialConnectionNotification) {
        await redisFunc.publishNotification(socialConnectionNotification as WebNotification);

        await publishTelegramNotification(socialConnectionNotification as WebNotification);
        
        //Check if user exists in the session and later emit notification
        for (const member of socialConnectionNotification.notificationData.to.to) {
          io.to(member).emit('connection_requests', socialConnectionNotification);
        }
      } else {
        console.log('Social Connection Notification not generated');
        io.to(notificationPartialData.from.from).emit('connection_requests', socialConnectionNotification);
      }
    });

    socket.on('connection_accepted_request', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const socialConnectionNotification: WebNotification | null =
        await contributorNotificationTemplateHandler.connectionAcceptedNotification(notificationPartialData);

      if (socialConnectionNotification) {
        await redisFunc.publishNotification(socialConnectionNotification as WebNotification);

        await publishTelegramNotification(socialConnectionNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of socialConnectionNotification.notificationData.to.to) {
          io.to(member).emit('all', socialConnectionNotification);
        }
      } else {
        console.log('Social Connection Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', socialConnectionNotification);
      }
    });

    socket.on('contributor_complete_profile', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const completeProfileNotification: WebNotification | null =
        await contributorNotificationTemplateHandler.contributorCompleteProfileNotification(notificationPartialData);

      if (completeProfileNotification) {
        await redisFunc.publishNotification(completeProfileNotification as WebNotification);

        await publishTelegramNotification(completeProfileNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of completeProfileNotification.notificationData.to.to) {
          io.to(member).emit('all', completeProfileNotification);
        }
      } else {
        console.log('Complete Profile Notification not generated');
        io
          .to(notificationPartialData.from.from)
          .emit('all', completeProfileNotification);
      }
    });

    socket.on('contributor_complete_profile_to_apply_job', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const completeProfileNotification: WebNotification | null =
        await contributorNotificationTemplateHandler.contributorCompleteProfileForJobNotification(notificationPartialData);

      if (completeProfileNotification) {
        await redisFunc.publishNotification(completeProfileNotification as WebNotification);

        await publishTelegramNotification(completeProfileNotification as WebNotification)

        //Check if user exists in the session and later emit notification
        for (const member of completeProfileNotification.notificationData.to.to) {
          io.to(member).emit('all', completeProfileNotification);
        }
      } else {
        console.log('Complete Profile Notification not generated');
        io
          .to(notificationPartialData.from.from)
          .emit('all', completeProfileNotification);
      }
    });

    socket.on('contributor_subdomain_claimed_success', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const completeProfileNotification: WebNotification | null =
        await contributorNotificationTemplateHandler.contributorSubdomainClaimSuccessNotification(notificationPartialData);

      if (completeProfileNotification) {
        await redisFunc.publishNotification(completeProfileNotification as WebNotification);

        await publishTelegramNotification(completeProfileNotification as WebNotification)

        //Check if user exists in the session and later emit notification
        for (const member of completeProfileNotification.notificationData.to.to) {
          io.to(member).emit('all', completeProfileNotification);
        }
      } else {
        console.log('Complete Profile Notification not generated');
        io
          .to(notificationPartialData.from.from)
          .emit('all', completeProfileNotification);
      }
    });
  };
}
