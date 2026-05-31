import { publishTelegramNotification } from "../../telegramController";
import { WebNotification, NotificationPartialData, ErrorResponse } from "../utils/types";
import { ChatNotificationTemplateHandler } from "./utils/chatTemplates";

export class ChatSockets {
    chatNotification = (io: any, socket: any, redisFunc : any) => {

        const chatNotificationTemplateHandler = new ChatNotificationTemplateHandler()    
        
        socket.on('chat_requested_notification', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const chatNotification: WebNotification | null =
              await chatNotificationTemplateHandler.chatRequestNotification(notificationPartialData);
  
            if (chatNotification) {
              await redisFunc.publishNotification(chatNotification as WebNotification);

              await publishTelegramNotification(chatNotification as WebNotification);
              //Check if user exists in the session and later emit notification
              for (const member of chatNotification.notificationData.to.to) {
                io.to(member).emit('mentions', chatNotification);
              }
            } else {
              console.log('Chat Requested Notification not generated');
              io.to(notificationPartialData.from.from).emit('mentions', chatNotification);
            }
        });

        socket.on('chat_request_accepted_notification', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const chatNotification: WebNotification | null =
              await chatNotificationTemplateHandler.chatRequestAcceptedNotification(notificationPartialData);
  
            if (chatNotification) {
              await redisFunc.publishNotification(chatNotification as WebNotification);

              await publishTelegramNotification(chatNotification as WebNotification);

              //Check if user exists in the session and later emit notification
              for (const member of chatNotification.notificationData.to.to) {
                io.to(member).emit('all', chatNotification);
              }
            } else {
              console.log('Chat Request Accepted Notification not generated');
              io.to(notificationPartialData.from.from).emit('all', chatNotification);
            }
        });

        socket.on('message_recieved_notification', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const chatNotification: WebNotification | null =
              await chatNotificationTemplateHandler.messageRecievedNotification(notificationPartialData);
  
            if (chatNotification) {
              await redisFunc.publishNotification(chatNotification as WebNotification);

              await publishTelegramNotification(chatNotification as WebNotification);

              //Check if user exists in the session and later emit notification
              for (const member of chatNotification.notificationData.to.to) {
                io.to(member).emit('mentions', chatNotification);
              }
            } else {
              console.log('Message Recieved Notification not generated');
              io.to(notificationPartialData.from.from).emit('mentions', chatNotification);
            }
        });

        socket.on('group_message_received_notification', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const chatNotification: WebNotification | null =
              await chatNotificationTemplateHandler.groupMessageRecievedNotification(notificationPartialData);

            if (chatNotification) {
              await redisFunc.publishNotification(chatNotification as WebNotification);

              await publishTelegramNotification(chatNotification as WebNotification);

              //Check if user exists in the session and later emit notification
              for (const member of chatNotification.notificationData.to.to) {
                io.to(member).emit('all', chatNotification);
              }
            } else {
              console.log('Message Recieved Notification not generated');
              io.to(notificationPartialData.from.from).emit('all', chatNotification);
            }
         });

        socket.on('group_joining_request_notification', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const chatNotification: WebNotification | null =
              await chatNotificationTemplateHandler.groupJoiningRequestNotification(notificationPartialData);

            if (chatNotification) {
              await redisFunc.publishNotification(chatNotification as WebNotification);

              await publishTelegramNotification(chatNotification as WebNotification);

              //Check if user exists in the session and later emit notification
              for (const member of chatNotification.notificationData.to.to) {
                io.to(member).emit('all', chatNotification);
              }
            } else {
              console.log('Message Recieved Notification not generated');
              io.to(notificationPartialData.from.from).emit('all', chatNotification);
            }
       });

        socket.on('group_joining_accepted_notification', async (notificationPartialData: NotificationPartialData) => {
            //Generate the notification
            const chatNotification: WebNotification | null =
              await chatNotificationTemplateHandler.groupJoiningRequestAcceptedNotification(notificationPartialData);

            if (chatNotification) {
              await redisFunc.publishNotification(chatNotification as WebNotification);

              await publishTelegramNotification(chatNotification as WebNotification);

              //Check if user exists in the session and later emit notification
              for (const member of chatNotification.notificationData.to.to) {
                io.to(member).emit('all', chatNotification);
              }
            } else {
              console.log('Message Recieved Notification not generated');
              io.to(notificationPartialData.from.from).emit('all', chatNotification);
            }
       });
    }
}