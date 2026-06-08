import { ProjectNotificationHandler } from './utils/projectTemplates';
import { WebNotification, NotificationPartialData } from '../utils/types';
import { publishTelegramNotification } from '../../telegramController';

export class ProjectSockets {
  projectNotifications = (io: any, socket: any, redisFunc: any) => {
    const projectNotificationTemplateHandler = new ProjectNotificationHandler();

    socket.on('added_to_project', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const projectNotification: WebNotification | null =
        await projectNotificationTemplateHandler.addedToProjectNotification(notificationPartialData);

      if (projectNotification) {
        await redisFunc.publishNotification(projectNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of projectNotification.notificationData.to.to) {
          io.to(member).emit('mentions', projectNotification);
        }
      } else {
        console.log('Project Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', projectNotification);
      }
    });

    socket.on('added_to_task', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const taskNotification: WebNotification | null =
        await projectNotificationTemplateHandler.addedToTaskNotification(notificationPartialData);

      if (taskNotification) {
        await redisFunc.publishNotification(taskNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of taskNotification.notificationData.to.to) {
          io.to(member).emit('mentions', taskNotification);
        }
      } else {
        console.log('Task Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', taskNotification);
      }
    });

    socket.on('task_review', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification

      console.log('task_review', notificationPartialData);
      const reviewNotification: WebNotification | null =
        await projectNotificationTemplateHandler.taskReviewNotification(notificationPartialData);

      console.log(reviewNotification);
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

    socket.on('task_status_changed', async (notificationPartialData: NotificationPartialData) => {
      const statusChangedNotification: WebNotification | null =
        await projectNotificationTemplateHandler.taskStatusChangedNotification(notificationPartialData);

      if (statusChangedNotification) {
        await redisFunc.publishNotification(statusChangedNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of statusChangedNotification.notificationData.to.to) {
          io.to(member).emit('all', statusChangedNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', statusChangedNotification);
      }
    });

    socket.on('task_created', async (notificationPartialData: NotificationPartialData) => {
      const taskCreatedNotification: WebNotification | null =
        await projectNotificationTemplateHandler.taskCreatedNotification(notificationPartialData);

      if (taskCreatedNotification) {
        await redisFunc.publishNotification(taskCreatedNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of taskCreatedNotification.notificationData.to.to) {
          io.to(member).emit('all', taskCreatedNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', taskCreatedNotification);
      }
    });

    socket.on('task_deleted', async (notificationPartialData: NotificationPartialData) => {
      const taskDeletedNotification: WebNotification | null =
        await projectNotificationTemplateHandler.taskDeletedNotification(notificationPartialData);

      if (taskDeletedNotification) {
        await redisFunc.publishNotification(taskDeletedNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of taskDeletedNotification.notificationData.to.to) {
          io.to(member).emit('all', taskDeletedNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', taskDeletedNotification);
      }
    });

    socket.on('task_posted_as_job_or_bounty', async (notificationPartialData: NotificationPartialData) => {
      const taskPostedAsJobOrBountyNotification: WebNotification | null =
        await projectNotificationTemplateHandler.taskPostedAsJobOrBountyNotification(notificationPartialData);

      if (taskPostedAsJobOrBountyNotification) {
        await redisFunc.publishNotification(taskPostedAsJobOrBountyNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of taskPostedAsJobOrBountyNotification.notificationData.to.to) {
          io.to(member).emit('all', taskPostedAsJobOrBountyNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', taskPostedAsJobOrBountyNotification);
      }
    });

    socket.on('payout_assigned_contributor', async (notificationPartialData: NotificationPartialData) => {
      const PayoutAssignedContributorNotification: WebNotification | null =
        await projectNotificationTemplateHandler.PayoutAssignedContributorNotification(notificationPartialData);

      if (PayoutAssignedContributorNotification) {
        await redisFunc.publishNotification(PayoutAssignedContributorNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of PayoutAssignedContributorNotification.notificationData.to.to) {
          io.to(member).emit('all', PayoutAssignedContributorNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', PayoutAssignedContributorNotification);
      }
    });

    socket.on('payout_assigned_dao', async (notificationPartialData: NotificationPartialData) => {
      const PayoutAssignedDAONotification: WebNotification | null =
        await projectNotificationTemplateHandler.PayoutAssignedDAONotification(notificationPartialData);

      if (PayoutAssignedDAONotification) {
        await redisFunc.publishNotification(PayoutAssignedDAONotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of PayoutAssignedDAONotification.notificationData.to.to) {
          io.to(member).emit('all', PayoutAssignedDAONotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', PayoutAssignedDAONotification);
      }
    });

    socket.on('kanban_board_changes', async (notificationPartialData: NotificationPartialData) => {
      const PayoutAssignedDAONotification: WebNotification | null =
        await projectNotificationTemplateHandler.KanbanBoardChangedNotification(notificationPartialData);

      if (PayoutAssignedDAONotification) {
        await redisFunc.publishNotification(PayoutAssignedDAONotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of PayoutAssignedDAONotification.notificationData.to.to) {
          io.to(member).emit('all', PayoutAssignedDAONotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', PayoutAssignedDAONotification);
      }
    });

    socket.on('task_status_to_completed', async (notificationPartialData: NotificationPartialData) => {
      const TaskStatusChangedToCompletedNotification: WebNotification | null =
        await projectNotificationTemplateHandler.TaskStatusChangedToCompletedNotification(notificationPartialData);

      if (TaskStatusChangedToCompletedNotification) {
        await redisFunc.publishNotification(TaskStatusChangedToCompletedNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of TaskStatusChangedToCompletedNotification.notificationData.to.to) {
          io.to(member).emit('all', TaskStatusChangedToCompletedNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', TaskStatusChangedToCompletedNotification);
      }
    });

    socket.on('comment_on_task_notification', async (notificationPartialData: NotificationPartialData) => {
      const CommentOnTaskNotification: WebNotification | null =
        await projectNotificationTemplateHandler.CommentOnTaskNotification(notificationPartialData);

      if (CommentOnTaskNotification) {
        await redisFunc.publishNotification(CommentOnTaskNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of CommentOnTaskNotification.notificationData.to.to) {
          io.to(member).emit('all', CommentOnTaskNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', CommentOnTaskNotification);
      }
    });

    socket.on('attachment_added_to_task', async (notificationPartialData: NotificationPartialData) => {
      const AttachmentAddedToTask: WebNotification | null =
        await projectNotificationTemplateHandler.AttachmentAddedToTask(notificationPartialData);

      if (AttachmentAddedToTask) {
        await redisFunc.publishNotification(AttachmentAddedToTask as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of AttachmentAddedToTask.notificationData.to.to) {
          io.to(member).emit('all', AttachmentAddedToTask);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', AttachmentAddedToTask);
      }
    });

    socket.on('task_assigned_to_contributor', async (notificationPartialData: NotificationPartialData) => {
      const TaskAssignedToContributorNotification: WebNotification | null =
        await projectNotificationTemplateHandler.TaskAssignedToContributorNotification(notificationPartialData);

      if (TaskAssignedToContributorNotification) {
        await redisFunc.publishNotification(TaskAssignedToContributorNotification as WebNotification);

        await publishTelegramNotification(TaskAssignedToContributorNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of TaskAssignedToContributorNotification.notificationData.to.to) {
          io.to(member).emit('mentions', TaskAssignedToContributorNotification);
        }
      } else {
        console.log('Task Assigned Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', TaskAssignedToContributorNotification);
      }
    });

    socket.on('contributor_removed_from_task_contributor', async (notificationPartialData: NotificationPartialData) => {
      const ContributorRemovedFromTaskContributorNotification: WebNotification | null =
        await projectNotificationTemplateHandler.ContributorRemovedFromTaskContributorNotification(
          notificationPartialData,
        );

      if (ContributorRemovedFromTaskContributorNotification) {
        await redisFunc.publishNotification(ContributorRemovedFromTaskContributorNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of ContributorRemovedFromTaskContributorNotification.notificationData.to.to) {
          io.to(member).emit('all', ContributorRemovedFromTaskContributorNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', ContributorRemovedFromTaskContributorNotification);
      }
    });

    socket.on('contributor_removed_from_task_dao', async (notificationPartialData: NotificationPartialData) => {
      const ContributorRemovedFromTaskDAONotification: WebNotification | null =
        await projectNotificationTemplateHandler.ContributorRemovedFromTaskDAONotification(notificationPartialData);

      if (ContributorRemovedFromTaskDAONotification) {
        await redisFunc.publishNotification(ContributorRemovedFromTaskDAONotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of ContributorRemovedFromTaskDAONotification.notificationData.to.to) {
          io.to(member).emit('all', ContributorRemovedFromTaskDAONotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', ContributorRemovedFromTaskDAONotification);
      }
    });

    socket.on('edit_in_task', async (notificationPartialData: NotificationPartialData) => {
      const EditInTaskNotification: WebNotification | null =
        await projectNotificationTemplateHandler.EditInTaskNotification(notificationPartialData);

      if (EditInTaskNotification) {
        await redisFunc.publishNotification(EditInTaskNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of EditInTaskNotification.notificationData.to.to) {
          io.to(member).emit('all', EditInTaskNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', EditInTaskNotification);
      }
    });

    socket.on('review_nudge_contributor', async (notificationPartialData: NotificationPartialData) => {
      const ReviewNudgeContributorNotification: WebNotification | null =
        await projectNotificationTemplateHandler.ReviewNudgeContributorNotification(notificationPartialData);

      if (ReviewNudgeContributorNotification) {
        await redisFunc.publishNotification(ReviewNudgeContributorNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        await publishTelegramNotification(ReviewNudgeContributorNotification as WebNotification);

        for (const member of ReviewNudgeContributorNotification.notificationData.to.to) {
          io.to(member).emit('all', ReviewNudgeContributorNotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', ReviewNudgeContributorNotification);
      }
    });

    socket.on('review_nudge_dao', async (notificationPartialData: NotificationPartialData) => {
      const ReviewNudgeDAONotification: WebNotification | null =
        await projectNotificationTemplateHandler.ReviewNudgeDAONotification(notificationPartialData);

      if (ReviewNudgeDAONotification) {
        await redisFunc.publishNotification(ReviewNudgeDAONotification as WebNotification);

        await publishTelegramNotification(ReviewNudgeDAONotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of ReviewNudgeDAONotification.notificationData.to.to) {
          io.to(member).emit('all', ReviewNudgeDAONotification);
        }
      } else {
        console.log('Review Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', ReviewNudgeDAONotification);
      }
    });
  };
}
