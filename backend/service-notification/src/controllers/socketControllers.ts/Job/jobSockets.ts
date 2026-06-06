import { JobNotificationTemplateHandler } from './utils/jobTemplates';
import { WebNotification, NotificationPartialData, ErrorResponse } from '../utils/types';
import { publishTelegramNotification } from '../../telegramController';

export class JobSockets {
  jobNotifications = (io: any, socket: any, redisFunc: any) => {
    const jobNotificationTemplateHandler = new JobNotificationTemplateHandler();

    socket.on('job_posted_notification', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const reviewNotification: WebNotification | null =
        await jobNotificationTemplateHandler.postingJob(notificationPartialData);

      if (reviewNotification) {
        await redisFunc.publishNotification(reviewNotification as WebNotification);

        await publishTelegramNotification(reviewNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of reviewNotification.notificationData.to.to) {
          io.to(member).emit('all', reviewNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', reviewNotification);
      }
    });

    socket.on('bounty_posted_notification', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const reviewNotification: WebNotification | null =
        await jobNotificationTemplateHandler.postingBounty(notificationPartialData);

      if (reviewNotification) {
        await redisFunc.publishNotification(reviewNotification as WebNotification);

        await publishTelegramNotification(reviewNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of reviewNotification.notificationData.to.to) {
          io.to(member).emit('all', reviewNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', reviewNotification);
      }
    });

    socket.on('job_applicant_submitted', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const reviewNotification: WebNotification | null =
        await jobNotificationTemplateHandler.jobApplicantNotification(notificationPartialData);

      if (reviewNotification) {
        await redisFunc.publishNotification(reviewNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of reviewNotification.notificationData.to.to) {
          io.to(member).emit('all', reviewNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', reviewNotification);
      }
    });

    socket.on('bounty_submission', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const bountyNotification: WebNotification | null =
        await jobNotificationTemplateHandler.bountySubmissionNotification(notificationPartialData);

      if (bountyNotification) {
        await redisFunc.publishNotification(bountyNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of bountyNotification.notificationData.to.to) {
          io.to(member).emit('all', bountyNotification);
        }
      } else {
        console.log('Bounty Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', bountyNotification);
      }
    });

    socket.on('job_applicant_accepted', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const reviewNotification: WebNotification | null =
        await jobNotificationTemplateHandler.accecptanceOfJobApplicantNotification(notificationPartialData);

      if (reviewNotification) {
        await redisFunc.publishNotification(reviewNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of reviewNotification.notificationData.to.to) {
          io.to(member).emit('mentions', reviewNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', reviewNotification);
      }
    });

    socket.on('bounty_rewarded', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const bountyNotification: WebNotification | null =
        await jobNotificationTemplateHandler.rewardingBountySubmissionNotification(notificationPartialData);

      if (bountyNotification) {
        await redisFunc.publishNotification(bountyNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of bountyNotification.notificationData.to.to) {
          io.to(member).emit('mentions', bountyNotification);
        }
      } else {
        console.log('Bounty Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', bountyNotification);
      }
    });

    socket.on('job_applicant_rejected', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const reviewNotification: WebNotification | null =
        await jobNotificationTemplateHandler.rejectingJobApplicantNotification(notificationPartialData);

      if (reviewNotification) {
        await redisFunc.publishNotification(reviewNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of reviewNotification.notificationData.to.to) {
          io.to(member).emit('all', reviewNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', reviewNotification);
      }
    });

    socket.on('bounty_submission_rejected', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const bountyNotification: WebNotification | null =
        await jobNotificationTemplateHandler.rejectingBountySubmissionNotification(notificationPartialData);

      if (bountyNotification) {
        await redisFunc.publishNotification(bountyNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of bountyNotification.notificationData.to.to) {
          io.to(member).emit('all', bountyNotification);
        }
      } else {
        console.log('Bounty Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', bountyNotification);
      }
    });
  };
}
