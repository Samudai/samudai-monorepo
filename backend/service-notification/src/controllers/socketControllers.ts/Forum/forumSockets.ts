import { publishTelegramNotification } from '../../telegramController';
import { WebNotification, NotificationPartialData, ErrorResponse } from '../utils/types';
import { ForumNotificationTemplateHandler } from './utils/forumTemplates';

export class ForumSockets {
  forumNotifications = (io: any, socket: any, redisFunc: any) => {
    const forumNotificationTemplateHandler = new ForumNotificationTemplateHandler();

    socket.on('discussion_created', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification

      const discussionCreatedNotification: WebNotification | null =
        await forumNotificationTemplateHandler.discussionCreatedNotification(notificationPartialData);

      if (discussionCreatedNotification) {
        await redisFunc.publishNotification(discussionCreatedNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionCreatedNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionCreatedNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionCreatedNotification);
      }
    });

    socket.on('invited_to_discussion', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.invitedToDiscussion(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);

        await publishTelegramNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('mentions', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', discussionInvitationNotification);
      }
    });

    socket.on('new_proposal_discussion', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.newProposalDiscussion(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);

        await publishTelegramNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionInvitationNotification);
      }
    });

    socket.on('added_to_discussion', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.addedtoDiscussion(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);

        await publishTelegramNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('mentions', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', discussionInvitationNotification);
      }
    });

    socket.on('member_joined', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.memberJoined(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);

        await publishTelegramNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionInvitationNotification);
      }
    });

    socket.on('member_left', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.memberLeft(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);

        await publishTelegramNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionInvitationNotification);
      }
    });

    socket.on('comment_added_on_discussion', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.commentAddedOnDiscussion(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);

        await publishTelegramNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionInvitationNotification);
      }
    });

    socket.on('most_liked_comment', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionNotification: WebNotification | null =
        await forumNotificationTemplateHandler.mostLikedComment(notificationPartialData);

      if (discussionNotification) {
        await redisFunc.publishNotification(discussionNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionNotification);
      }
    });

    socket.on('most_viewed_discussion', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionNotification: WebNotification | null =
        await forumNotificationTemplateHandler.mostViewedDiscussion(notificationPartialData);

      if (discussionNotification) {
        await redisFunc.publishNotification(discussionNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionNotification);
      }
    });

    socket.on('most_active_participant', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionNotification: WebNotification | null =
        await forumNotificationTemplateHandler.mostActiveParticipant(notificationPartialData);

      if (discussionNotification) {
        await redisFunc.publishNotification(discussionNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionNotification);
      }
    });

    socket.on('most_active_participant_to_creator', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionNotification: WebNotification | null =
        await forumNotificationTemplateHandler.mostActiveParticipantToCreator(notificationPartialData);

      if (discussionNotification) {
        await redisFunc.publishNotification(discussionNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionNotification);
      }
    });

    socket.on('collected_comments_notification', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.collectedCommentsNotification(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionInvitationNotification);
      }
    });

    socket.on('discussion_closed', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const discussionInvitationNotification: WebNotification | null =
        await forumNotificationTemplateHandler.discussionClosedNotification(notificationPartialData);

      if (discussionInvitationNotification) {
        await redisFunc.publishNotification(discussionInvitationNotification as WebNotification);

        await publishTelegramNotification(discussionInvitationNotification as WebNotification);
        //Check if user exists in the session and later emit notification
        for (const member of discussionInvitationNotification.notificationData.to.to) {
          io.to(member).emit('all', discussionInvitationNotification);
        }
      } else {
        console.log('Form Response Notification not generated');
        io.to(notificationPartialData.from.from).emit('all', discussionInvitationNotification);
      }
    });

    socket.on('reply_to_comment', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const commentReplyNotification: WebNotification | null =
        await forumNotificationTemplateHandler.commentReplyNotification(notificationPartialData);

      if (commentReplyNotification) {
        await redisFunc.publishNotification(commentReplyNotification as WebNotification);

        await publishTelegramNotification(commentReplyNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of commentReplyNotification.notificationData.to.to) {
          io.to(member).emit('mentions', commentReplyNotification);
        }
      } else {
        console.log('Comment Reply Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', commentReplyNotification);
      }
    });

    socket.on('tagged_in_comment', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const commentTaggedNotification: WebNotification | null =
        await forumNotificationTemplateHandler.commentTaggedNotification(notificationPartialData);

      if (commentTaggedNotification) {
        await redisFunc.publishNotification(commentTaggedNotification as WebNotification);

        await publishTelegramNotification(commentTaggedNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of commentTaggedNotification.notificationData.to.to) {
          io.to(member).emit('mentions', commentTaggedNotification);
        }
      } else {
        console.log('Comment Tagged Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', commentTaggedNotification);
      }
    });

    socket.on('all_tagged_in_comment', async (notificationPartialData: NotificationPartialData) => {
      //Generate the notification
      const allTaggedNotification: WebNotification | null =
        await forumNotificationTemplateHandler.allTaggedNotification(notificationPartialData);

      if (allTaggedNotification) {
        await redisFunc.publishNotification(allTaggedNotification as WebNotification);

        await publishTelegramNotification(allTaggedNotification as WebNotification);

        //Check if user exists in the session and later emit notification
        for (const member of allTaggedNotification.notificationData.to.to) {
          io.to(member).emit('mentions', allTaggedNotification);
        }
      } else {
        console.log('All Tagged Notification not generated');
        io.to(notificationPartialData.from.from).emit('mentions', allTaggedNotification);
      }
    });
  };
}
