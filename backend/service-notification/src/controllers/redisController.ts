import { Response, Request } from 'express';
import { RedisFunctions } from '../lib/redis';

export class RedisController {
  private redisFunc: RedisFunctions;
  constructor() {
    this.redisFunc = new RedisFunctions();
  }

  getNotificationsForUser = async (req: Request, res: Response) => {
    try {
      const memberId = req.params.memberId as string;
      const notifications: any = await this.redisFunc.getNotifications(memberId);

      res.status(200).send({
        message: 'Notifications retrieved successfully',
        data: notifications,
      });
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not retrieve Notifications', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting notifications', error: JSON.stringify(err) });
      }
    }
  };

  readNotificationById = async (req: Request, res: Response) => {
    try {
      const notificationId = req.params.notificationId as string;
      const memberId = req.params.memberId as string;

      const result = await this.redisFunc.updateReadReceiptForNotification(memberId, notificationId);

      res.status(200).send({
        message: 'Notifications Read successfully',
        data: result,
      });
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not read Notification', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error reading notifications', error: JSON.stringify(err) });
      }
    }
  };

  //   updateNotificationStatusForUser = async (req: Request, res: Response) => {
  //     try {
  //       const memberId = req.params.memberId;
  //       const notificationId = req.params.notificationId;
  //       const notificationData = req.body;
  //       const result = await this.redisFunc.updateNotification(memberId, notificationId, notificationData);
  //       res.status(200).send({
  //         message: 'Notification updated successfully',
  //         data: result,
  //       });
  //     } catch (err: any) {
  //       if (err.response) {
  //         return res
  //           .status(err.response.status)
  //           .send({ message: 'Could not update Notification', error: err.response.data.err });
  //       } else {
  //         return res.status(500).send({ message: 'Error updating notification', error: JSON.stringify(err) });
  //       }
  //     }
  //   };
}
