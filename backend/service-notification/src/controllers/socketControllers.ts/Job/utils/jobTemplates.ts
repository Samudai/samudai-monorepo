import axios from 'axios';
import { getMemberByWallet, getMemberInfo } from '../../utils/helpers';
import { NotificationPartialData, 
    WebNotification, 
    NotificationContent,
 } from "../../utils/types";
import { generateJWT } from '../../../../lib/jwt';
import { NewNotificationScope, NewNotificationType, NotificationFor, NotificationScope, NotificationStatus, NotificationType } from "../../utils/enums";
import { JobApplicantNotificationMetaData, BountySubmissionNotificationMetaData, AccecptanceOfJobApplicantNotificationMetaData, postingJobNotificationMetaData, postingBountyNotificationMetaData } from './types';


export class JobNotificationTemplateHandler {
  
    postingJob = async  (
      notificationPartialData: NotificationPartialData
    ): Promise<WebNotification | null> => {
      try {
        const { to, from, metaData, timestamp } = notificationPartialData;
        const jwt = generateJWT(from.from);

        const openToWorkContributor = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors/open_to_work`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        to.to = openToWorkContributor.data.data.contributors;

        // Job Info
        const job = await axios.get(`${process.env.GATEWAY_URL}/api/jobs/get/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const jobDetails = job.data.data.opportunity

        //User Info
        const memberResult = await getMemberInfo(from.from, jwt);
        const member = memberResult;

        const postingJobNotificationMetaData: postingJobNotificationMetaData = {
          member: {
            member_id: member.member_id,
            username: member.username,
            profile_picture: member.profile_picture,
            name: member.name,
          },
          job: {
            job_id : jobDetails.job_id,
            title : jobDetails.title,
            dao_id : jobDetails.dao_id,
            dao_name : jobDetails.dao_name
          },
          redirect_link: metaData?.redirect_link,
        };
  
        const notificationContent: NotificationContent = {
          type: NewNotificationType.ALL,
          tags: ["Job"],
          popup: false,
          notificationHeader: `New job opportunity posted by ${jobDetails.dao_name} - Apply now!`,
          notificationBody: `New job opportunity posted by ${jobDetails.dao_name} - Apply now!`,
          metaData: postingJobNotificationMetaData,
        };
  
        const notification: WebNotification = {
          notificationId: `${from.from}-${to.to.length}-${timestamp}`,
          notificationData: notificationPartialData,
          notificationStatus: NotificationStatus.Pending,
          notificationContent: notificationContent,
          timestamp: Date.now(),
          scope: NewNotificationScope.ALL,
        };
  
        return notification;

      } catch (err: any) {
        console.log(err);
        return null;
      }
    };

    postingBounty = async  (
      notificationPartialData: NotificationPartialData
    ): Promise<WebNotification | null> => {
      try {
        const { to, from, metaData, timestamp } = notificationPartialData;
        const jwt = generateJWT(from.from);

        const openToWorkContributor = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors/open_to_work`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        to.to = openToWorkContributor.data.data.contributors;

        // Bounty Info
        const bounty = await axios.get(`${process.env.GATEWAY_URL}/api/bounty/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        const bountyDetails = bounty.data.data.bounty

        //User Info
        const memberResult = await getMemberInfo(from.from, jwt);
        const member = memberResult;

        const postingBountyNotificationMetaData: postingBountyNotificationMetaData = {
          member: {
            member_id: member.member_id,
            username: member.username,
            profile_picture: member.profile_picture,
            name: member.name,
          },
          bounty: {
            bounty_id : bountyDetails.bounty_id,
            title : bountyDetails.title,
            dao_id : bountyDetails.dao_id,
            dao_name : bountyDetails.dao_name
          },
          redirect_link: metaData?.redirect_link,
        };
  
        const notificationContent: NotificationContent = {
          type: NewNotificationType.ALL,
          tags: ["Bounty"],
          popup: true,
          notificationHeader: `New bounty posted by ${bountyDetails.dao_name} - Check it out and earn rewards!`,
          notificationBody: `New bounty posted by ${bountyDetails.dao_name} - Check it out and earn rewards!`,
          metaData: postingBountyNotificationMetaData,
        };
  
        const notification: WebNotification = {
          notificationId: `${from.from}-${to.to.length}-${timestamp}`,
          notificationData: notificationPartialData,
          notificationStatus: NotificationStatus.Pending,
          notificationContent: notificationContent,
          timestamp: Date.now(),
          scope: NewNotificationScope.ALL,
        };
  
        return notification;

      } catch (err: any) {
        console.log(err);
        return null;
      }
    };

    jobApplicantNotification = async (
        notificationPartialData: NotificationPartialData
      ): Promise<WebNotification | null> => {
        try {
          const { to, from, metaData, timestamp } = notificationPartialData;
          const jwt = generateJWT(from.from);
    
          if (to.for === NotificationFor.ADMIN) {
            const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            });
            const admins = result.data.data.admins;
            to.to = admins;
          }
    
          //Task info
          const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          const task = taskResult.data.data;
    
          //User Info
          const memberResult = await getMemberInfo(from.from, jwt);
          const member = memberResult;
    
          const JobApplicantNotificationMetaData: JobApplicantNotificationMetaData = {
            member: {
              member_id: member.member_id,
              username: member.username,
              profile_picture: member.profile_picture,
              name: member.name,
            },
            applicant: {
              username: member.username,
              member_id: member.member_id,
            },
            job: {
              title: task.title,
              id: task.task_id,
              applied_on: timestamp,
            },
            redirect_link: metaData?.redirect_link,
          };
    
          const notificationContent: NotificationContent = {
            type: NewNotificationType.ALL,
            tags: ["Job", "Applicant"],
            popup: false,
            notificationHeader: `New Job Application for ${task.title}`,
            notificationBody: `${member.username} has applied for ${task.title} - Time to review their profile!`,
            metaData: JobApplicantNotificationMetaData,
          };
    
          const notification: WebNotification = {
            notificationId: `${from.from}-${to.to.length}-${timestamp}`,
            notificationData: notificationPartialData,
            notificationStatus: NotificationStatus.Pending,
            notificationContent: notificationContent,
            timestamp: Date.now(),
            scope: NewNotificationScope.ALL,
          };
    
          return notification;
        } catch (err: any) {
          console.log(err);
          return null;
        }
    };
    
    bountySubmissionNotification = async (
        notificationPartialData: NotificationPartialData
      ): Promise<WebNotification | null> => {
        try {
          const { to, from, metaData, timestamp } = notificationPartialData;
          const jwt = generateJWT(from.from);
          if (to.for === NotificationFor.ADMIN) {
            const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
            });
            const admins = result.data.data.admins;
            to.to = admins;
          }
    
          //Bounty info
          const submissionResult = await axios.get(`${process.env.GATEWAY_URL}/api/submission/get/${metaData?.id}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          const submission = submissionResult.data.data;
    
          //Captain info
          //User Info
          const memberResult = await getMemberInfo(from.from, jwt);
          const member = memberResult;
    
          const BountySubmissionNotificationMetaData: BountySubmissionNotificationMetaData = {
            member: {
              member_id: member.member_id,
              username: member.username,
              profile_picture: member.profile_picture,
              name: member.name,
            },
            submittedBy: {
              username: member.username,
              member_id: member.member_id,
            },
            bounty: {
              bounty_id: submission.bounty_id,
              submission_id: submission.submission_id,
            },
            redirect_link: metaData?.redirect_link,
          };
    
          const notificationContent: NotificationContent = {
            type: NewNotificationType.ALL,
            tags: ["Bounty", "Submission"],
            popup: false,
            notificationHeader: `Bounty submission by ${member.username} - Time to evaluate and reward!`,
            notificationBody: `Bounty submission by ${member.username} - Time to evaluate and reward!`,
            metaData: BountySubmissionNotificationMetaData,
          };
    
          const notification: WebNotification = {
            notificationId: `${from.from}-${to.to.length}-${timestamp}`,
            notificationData: notificationPartialData,
            notificationStatus: NotificationStatus.Pending,
            notificationContent: notificationContent,
            timestamp: Date.now(),
            scope: NewNotificationScope.ALL,
          };
    
          return notification;
        } catch (err: any) {
          console.log(err);
          return null;
        }
    };

    accecptanceOfJobApplicantNotification = async (
      notificationPartialData: NotificationPartialData
    ): Promise<WebNotification | null> => {
      try {
        const { to, from, metaData, timestamp } = notificationPartialData;
        const offering_dao_id = metaData?.extra?.dao_id;
        const jwt = generateJWT(from.from);

        // Dao info
        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${offering_dao_id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoDetails = daoresult.data.data.dao;
  
        //Task info
        const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const task = taskResult.data.data;
  
        //Captain info
        //User Info
        const memberResult = await getMemberInfo(from.from, jwt);
        const member = memberResult;
  
        const AccecptanceOfJobApplicantNotificationMetaData: AccecptanceOfJobApplicantNotificationMetaData  = {
          member: {
            member_id: member.member_id,
            username: member.username,
            profile_picture: member.profile_picture,
            name: member.name,
          },
          job: {
            title: task.title,
            id: task.task_id,
            applied_on: timestamp,
            contributors : task.assignee_member
          },
          redirect_link: metaData?.redirect_link,
        };
  
        const notificationContent: NotificationContent = {
          type: NewNotificationType.MENTIONS,
          tags: ["Job"],  
          popup: true,
          notificationHeader: `Accepted for a Job`,
          notificationBody: `New task assigned by ${daoDetails.name} - Time to get to work!`,
          metaData: AccecptanceOfJobApplicantNotificationMetaData,
        };
  
        const notification: WebNotification = {
          notificationId: `${from.from}-${to.to.length}-${timestamp}`,
          notificationData: notificationPartialData,
          notificationStatus: NotificationStatus.Pending,
          notificationContent: notificationContent,
          timestamp: Date.now(),
          scope: NewNotificationScope.MENTIONS,
        };
  
        return notification;
      } catch (err: any) {
        console.log(err);
        return null;
      }

    };

    rewardingBountySubmissionNotification = async (
      notificationPartialData: NotificationPartialData
    ): Promise<WebNotification | null> => {
      try {
        const { to, from, metaData, timestamp } = notificationPartialData;
        const offering_dao_id = metaData?.extra?.dao_id;
        const jwt = generateJWT(from.from);
  
        // Dao info
        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${offering_dao_id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoDetails = daoresult.data.data.dao;

        //Bounty info
        const submissionResult = await axios.get(`${process.env.GATEWAY_URL}/api/submission/get/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const submission = submissionResult.data.data;
  
        //Captain info
        //User Info
        const memberResult = await getMemberInfo(from.from, jwt);
        const member = memberResult;

        const RewardingBountySubmissionNotificationMetaData: BountySubmissionNotificationMetaData = {
          member: {
            member_id: member.member_id,
            username: member.username,
            profile_picture: member.profile_picture,
            name: member.name,
          },
          submittedBy: {
            username: member.username,
            member_id: member.member_id,
          },
          bounty: {
            bounty_id: submission.bounty_id,
            submission_id: submission.submission_id,
          },
          redirect_link: metaData?.redirect_link,
        };
  
        const notificationContent: NotificationContent = {
          type: NewNotificationType.MENTIONS,
          tags: ["Bounty"],
          popup: true,
          notificationHeader: `Bounty Rewarded`,
          notificationBody: `Bounty submission rewarded by ${daoDetails.name}- Congrats, reward is on the way!`,
          metaData: RewardingBountySubmissionNotificationMetaData,
        };
  
        const notification: WebNotification = {
          notificationId: `${from.from}-${to.to.length}-${timestamp}`,
          notificationData: notificationPartialData,
          notificationStatus: NotificationStatus.Pending,
          notificationContent: notificationContent,
          timestamp: Date.now(),
          scope: NewNotificationScope.MENTIONS,
        };
  
        return notification;
      } catch (err: any) {
        console.log(err);
        return null;
      }

    };

    rejectingJobApplicantNotification = async (
      notificationPartialData: NotificationPartialData
    ): Promise<WebNotification | null> => {
      try {
        const { to, from, metaData, timestamp } = notificationPartialData;
        const offering_dao_id = metaData?.extra?.dao_id;
        const jwt = generateJWT(from.from);

        // Dao info
        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${offering_dao_id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoDetails = daoresult.data.data.dao;
  
        //Task info
        const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const task = taskResult.data.data;
  
        //Captain info
        //User Info
        const memberResult = await getMemberInfo(from.from, jwt);
        const member = memberResult;
  
        const AccecptanceOfJobApplicantNotificationMetaData: AccecptanceOfJobApplicantNotificationMetaData  = {
          member: {
            member_id: member.member_id,
            username: member.username,
            profile_picture: member.profile_picture,
            name: member.name,
          },
          job: {
            title: task.title,
            id: task.task_id,
            applied_on: timestamp,
            contributors : task.assignee_member
          },
          redirect_link: metaData?.redirect_link,
        };
  
        const notificationContent: NotificationContent = {
          type: NewNotificationType.ALL,
          tags: ["Job"],
          popup: false,
          notificationHeader: `Accepted for a Job`,
          notificationBody: `Job application rejected by ${daoDetails.name} - Keep applying for other opportunities!`,
          metaData: AccecptanceOfJobApplicantNotificationMetaData,
        };
  
        const notification: WebNotification = {
          notificationId: `${from.from}-${to.to.length}-${timestamp}`,
          notificationData: notificationPartialData,
          notificationStatus: NotificationStatus.Pending,
          notificationContent: notificationContent,
          timestamp: Date.now(),
          scope: NewNotificationScope.ALL,
        };
  
        return notification;
      } catch (err: any) {
        console.log(err);
        return null;
      }

    };

    rejectingBountySubmissionNotification = async (
      notificationPartialData: NotificationPartialData
    ): Promise<WebNotification | null> => {
      try {
        const { to, from, metaData, timestamp } = notificationPartialData;
        const offering_dao_id = metaData?.extra?.dao_id;
        const jwt = generateJWT(from.from);
  
        // Dao info
        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${offering_dao_id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoDetails = daoresult.data.data.dao;

        //Bounty info
        const submissionResult = await axios.get(`${process.env.GATEWAY_URL}/api/submission/get/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const submission = submissionResult.data.data;
  
        //Captain info
        //User Info
        const memberResult = await getMemberInfo(from.from, jwt);
        const member = memberResult;

        const RejectingBountySubmissionNotificationMetaData: BountySubmissionNotificationMetaData = {
          member: {
            member_id: member.member_id,
            username: member.username,
            profile_picture: member.profile_picture,
            name: member.name,
          },
          submittedBy: {
            username: member.username,
            member_id: member.member_id,
          },
          bounty: {
            bounty_id: submission.bounty_id,
            submission_id: submission.submission_id,
          },
          redirect_link: metaData?.redirect_link,
        };
  
        const notificationContent: NotificationContent = {
          type: NewNotificationType.ALL,
          tags: ["Bounty"],
          popup: false,
          notificationHeader: `Bounty Rewarded`,
          notificationBody: `Bounty submission rejected by ${daoDetails.name} - Keep trying for other opportunities!`,
          metaData: RejectingBountySubmissionNotificationMetaData,
        };
  
        const notification: WebNotification = {
          notificationId: `${from.from}-${to.to.length}-${timestamp}`,
          notificationData: notificationPartialData,
          notificationStatus: NotificationStatus.Pending,
          notificationContent: notificationContent,
          timestamp: Date.now(),
          scope: NotificationScope.HEADS_UP,
        };
  
        return notification;
      } catch (err: any) {
        console.log(err);
        return null;
      }

    };
}