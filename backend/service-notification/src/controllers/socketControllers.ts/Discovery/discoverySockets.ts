import { WebNotification, NotificationPartialData } from '../utils/types';
import { DiscoveryNotificationTemplateHandler } from './utils/discoveryTemplates';

export class DiscoverySockets {
  discoveryNotifications = (io: any, socket: any, redisFunc: any) => {
    const discoveryNotificationTemplateHandler = new DiscoveryNotificationTemplateHandler();

    socket.on('profile_view_notifications', async (notificationPartialData: NotificationPartialData) => {
      const discoveryNotification: WebNotification | null =
        await discoveryNotificationTemplateHandler.viewedProfileNotification(notificationPartialData);

      if (discoveryNotification) {
        await redisFunc.publishNotification(discoveryNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discoveryNotification.notificationData.to.to) {
          io.to(member).emit('all', discoveryNotification);
        }
      } else {
        console.log('Payment Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discoveryNotification);
      }
    });
  };
}
