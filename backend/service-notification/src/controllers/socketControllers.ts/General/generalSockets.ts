import { publishTelegramNotification } from "../../telegramController";
import { WebNotification, NotificationPartialData, ErrorResponse } from "../utils/types";
import { GeneralNotificationTemplateHandler } from "./utils/generalTemplates";

export class GeneralSockets {

    generalNotifications = (io: any, socket: any, redisFunc : any) => {

        const generalNotificationTemplateHandler = new GeneralNotificationTemplateHandler();

        socket.on('meeting_created', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const meetingNotification: WebNotification | null =
              await generalNotificationTemplateHandler.meetingCreatedNotification(notificationPartialData);
  
            if (meetingNotification) {
              await redisFunc.publishNotification(meetingNotification as WebNotification);
              //Check if user exists in the session and later emit notification
              for (const member of meetingNotification.notificationData.to.to) {
                io.to(member).emit('all', meetingNotification);
              }
            } else {
              console.log('Meeting Notification not generated');
              io.to(notificationPartialData.from.from).emit('all', meetingNotification);
            }
        });
  
        socket.on('general_notification', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const activityNotification: WebNotification | null =
              await generalNotificationTemplateHandler.generalInformationNotification(notificationPartialData);
  
            if (activityNotification) {
              await redisFunc.publishNotification(activityNotification as WebNotification);
              //Check if user exists in the session and later emit notification
              for (const member of activityNotification.notificationData.to.to) {
                io.to(member).emit('all', activityNotification);
              }
            } else {
              console.log('Activity Notification not generated');
              io.to(notificationPartialData.from.from).emit('all', activityNotification);
            }
        });
  
        socket.on('deal_form_response', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const formResponseNotification: WebNotification | null =
              await generalNotificationTemplateHandler.dealFormResponseNotification(notificationPartialData);
  
            if (formResponseNotification) {
              await redisFunc.publishNotification(formResponseNotification as WebNotification);

              await publishTelegramNotification(formResponseNotification as WebNotification);
              
              //Check if user exists in the session and later emit notification
              for (const member of formResponseNotification.notificationData.to.to) {
                io.to(member).emit('all', formResponseNotification);
              }
            } else {
              console.log('Form Response Notification not generated');
              io.to(notificationPartialData.from.from).emit('all', formResponseNotification);
            }
        });
    }

}