require('dotenv').config();
import { WebNotification } from './socketControllers.ts/utils/types';
import { getTelegramChatIds } from './socketControllers.ts/utils/helpers';
import { generateJWT } from '../lib/jwt';
import axios from 'axios';

// export class TelegramController {

export const publishTelegramNotification = async (notification: WebNotification) => {
  try {
    const sendersList = notification.notificationData.to.to;
    const notificationMessage = notification.notificationContent.notificationBody;

    const jwt = generateJWT(sendersList[0]);

    const telegramInfo = await getTelegramChatIds(sendersList, jwt);

    const res = await axios.post(`${process.env.GATEWAY_EXTERNAL_URL}/telegram/publishnotifications`, {
      telegram: telegramInfo,
      notification_message: notificationMessage,
    });
  } catch (err: any) {
    console.log(err);
    return null;
  }
};

// }
