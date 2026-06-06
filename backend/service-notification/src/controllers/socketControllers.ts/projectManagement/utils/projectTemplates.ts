import axios from 'axios';
import { getMemberByWallet, getMemberInfo } from '../../utils/helpers';
import { NotificationPartialData, WebNotification, NotificationContent } from '../../utils/types';
import {
  TaskReviewNotificationMetaData,
  TaskStatusChangedNotificationMetaData,
  AddedToProjectNotificationMetaData,
  AddedToTaskNotificationMetaData,
  TaskCreatedNotificationMetaData,
  TaskDeletedNotificationMetaData,
  PayoutAssignedNotificationnMetaData,
  TaskAssignedToContributorNotificationMetaData,
  ReviewNudgeContributorNotificationMetaData,
  ReviewNudgeDAONotificationMetaData,
  KanbanBoardChangedNotificationMetaData,
} from './types';
import { NotificationFor, NewNotificationScope, NotificationStatus, NewNotificationType } from '../../utils/enums';
import { generateJWT } from '../../../../lib/jwt';

export class ProjectNotificationHandler {
  addedToProjectNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(from.from);

      const projectDetails = await axios.get(`${process.env.GATEWAY_URL}/api/project/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          projectid: metaData?.id!,
        },
      });
      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const AddedToProjectNotificationMetaData: AddedToProjectNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        project: {
          title: from.origin!,
          project_id: metaData?.id!,
          dao: metaData?.extra?.dao as string,
          added_by: from.from,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Project'],
        popup: false,
        notificationHeader: `${member.username} has added you to a project`,
        notificationBody: `${member.username} has added you to a project`,
        metaData: AddedToProjectNotificationMetaData,
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

  addedToTaskNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      //User Info
      const jwt = generateJWT(from.from);

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      //Task info
      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      const projectDetails = await axios.get(`${process.env.GATEWAY_URL}/api/project/${task.project_id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          projectid: task.project_id!,
        },
      });
      //User Info

      const AddedToTaskNotificationMetaData: AddedToTaskNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: metaData?.id!,
          added_by: from.from,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `${member.username} has added you to a task`,
        notificationBody: `${member.username} has added you to a task`,
        metaData: AddedToTaskNotificationMetaData,
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
      console.log(err.response.data);
      return null;
    }
  };

  taskReviewNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      //console.log('taskReviewNotification', notificationPartialData);
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

      const TaskReviewNotificationMetaData: TaskReviewNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        updatedBy: {
          username: member.username,
          member_id: member.member_id,
        },
        project: from.origin,
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        popup: false,
        tags: ['Task', 'Project'],
        notificationHeader: `New Task Review for ${task.title}`,
        notificationBody: `${member.username} has moved the ${task.title} to Review`,
        metaData: TaskReviewNotificationMetaData,
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

  taskStatusChangedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const reviewer_id: string = to.to[0];

      const jwt = generateJWT(from.from);

      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskStatusChangedNotificationMetaData: TaskStatusChangedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
          updated_status: metaData?.extra?.status as string,
        },
        updatedBy: {
          username: member.username,
          member_id: member.member_id,
        },
        project: metaData?.extra?.projectName as string,
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Task Status Changed for ${task.title}`,
        notificationBody: `${task.title} in ${metaData?.extra?.projectName} is shifted to ${metaData?.extra?.status} by ${member.name} - Keep track of changes! `,
        metaData: TaskStatusChangedNotificationMetaData,
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

  taskCreatedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];

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

      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskCreatedNotificationMetaData: TaskCreatedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        updatedBy: {
          username: member.username,
          member_id: member.member_id,
        },
        project: metaData?.extra?.projectName as string,
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Task Created Named ${task.title}`,
        notificationBody: `${task.title} is created in ${metaData?.extra?.projectName} by ${member.name}`,
        metaData: TaskCreatedNotificationMetaData,
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

  taskDeletedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      let task;
      let arr: string[] = [];

      const jwt = generateJWT(from.from);

      if (to.for === NotificationFor.ADMIN_MEMBER) {
        // const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        //   headers: {
        //     Authorization: `Bearer ${jwt}`,
        //   },
        // });
        // task = taskResult.data.data;

        // arr.push(task.poc_member_id);

        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoadmins = daoresult.data.data.admins;
        if (daoadmins) {
          arr = [...arr, ...daoadmins];
        }

        const projectresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_project`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const projectadmins = projectresult?.data?.data?.admins;
        if (projectadmins) {
          arr = [...arr, ...projectadmins];
        }

        const contributors = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const allContributors = contributors.data.data.contributors;
        if (allContributors) {
          arr = [...arr, ...allContributors];
        }

        const uniqueArray = [...new Set(arr)];

        to.to = uniqueArray;
      }

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskCreatedNotificationMetaData: TaskDeletedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: metaData?.extra?.task_title as string,
          task_id: metaData?.extra?.task_id as string,
          project_id: metaData?.extra?.project_id as string,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Task Deleted Named ${metaData?.extra?.task_title}`,
        notificationBody: `Task ${metaData?.extra?.task_title} deleted by ${member.name} - Keep track of changes!`,
        metaData: TaskCreatedNotificationMetaData,
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

  taskPostedAsJobOrBountyNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      let task;
      let job_type;
      let arr: string[] = [];

      const jwt = generateJWT(from.from);

      if (to.for === NotificationFor.ADMIN_MEMBER) {
        const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        task = taskResult.data.data;

        arr.push(task.poc_member_id);

        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoadmins = daoresult.data.data.admins;
        if (daoadmins) {
          arr = [...arr, ...daoadmins];
        }

        const projectresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_project`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const projectadmins = projectresult?.data?.data?.admins;
        if (projectadmins) {
          arr = [...arr, ...projectadmins];
        }

        const contributors = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const allContributors = contributors.data.data.contributors;
        if (allContributors) {
          arr = [...arr, ...allContributors];
        }

        const uniqueArray = [...new Set(arr)];

        to.to = uniqueArray;
      }

      if (task.associated_job_type === 'task') {
        job_type = 'job';
      } else {
        job_type = 'bounty';
      }

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskPostedAsJobOrBountyNotificationMetaData: TaskDeletedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `New Task posted as ${job_type}`,
        notificationBody: `New ${job_type} posted for ${task.title} by ${member.name} - Opportunity awaits!`,
        metaData: TaskPostedAsJobOrBountyNotificationMetaData,
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

  PayoutAssignedContributorNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(from.from);
      const payoutId = metaData?.extra?.payout_id;

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      const payout = task.payout.find((payout: any) => payout.payout_id === payoutId);

      const PayoutAssignedContributorNotificationnMetaData: PayoutAssignedNotificationnMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        payout: {
          member_id: payout.member_id,
          payout_amount: payout.payout_amount,
          payout_currency: payout.payout_currency,
          receiver_address: payout.receiver_address,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Payout Assigned for ${task.title}`,
        notificationBody: `You have been assigned a payout of ${payout.payout_amount} for ${task.title} by ${member.name}`,
        metaData: PayoutAssignedContributorNotificationnMetaData,
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

  PayoutAssignedDAONotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];

      const jwt = generateJWT(from.from);
      const payoutId = metaData?.extra?.payout_id;

      if (to.for === NotificationFor.ADMIN) {
        const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const admins = result.data.data.admins;
        to.to = admins;
      }

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      const payout = task.payout.find((payout: any) => payout.payout_id === payoutId);

      const PayoutAssignedDAONotificationnMetaData: PayoutAssignedNotificationnMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        payout: {
          member_id: payout.member_id,
          payout_amount: payout.payout_amount,
          payout_currency: payout.payout_currency,
          receiver_address: payout.receiver_address,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Payout Assigned for ${task.title}`,
        notificationBody: `${payout.payout_amount} payout is assigned to ${payout.name} for the ${task.title} by ${member.name}`,
        metaData: PayoutAssignedDAONotificationnMetaData,
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

  // PayoutGeneratedNotification = async (
  //   notificationPartialData: NotificationPartialData
  // ): Promise<WebNotification | null> => {
  //   try{
  //     const { to, from, metaData, timestamp } = notificationPartialData;
  //     const dao_id: string = to.to[0];

  //     const jwt = generateJWT(from.from);
  //     const payoutId = metaData?.extra?.payout_id;

  //     if (to.for === NotificationFor.ADMIN) {
  //       const result = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
  //         headers: {
  //           Authorization: `Bearer ${jwt}`,
  //         },
  //       });
  //       const admins = result.data.data.admins;
  //       to.to = admins;
  //     }

  //     const memberResult = await getMemberInfo(from.from, jwt);
  //     const member = memberResult;

  //     const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
  //       headers: {
  //         Authorization: `Bearer ${jwt}`,
  //       },
  //     });
  //     const task = taskResult.data.data;

  //     const payout = task.payout.find((payout: any) => payout.payout_id === payoutId)

  //     const PayoutAssignedDAONotificationnMetaData: PayoutAssignedNotificationnMetaData = {
  //       member: {
  //         member_id: member.member_id,
  //         username: member.username,
  //         profile_picture: member.profile_picture,
  //         name: member.name,
  //       },
  //       task: {
  //         title: task.title,
  //         task_id: task.task_id,
  //         project_id: task.project_id
  //       },
  //       payout: {
  //         member_id : payout.member_id,
  //         payout_amount : payout.payout_amount,
  //         payout_currency : payout.payout_currency,
  //         receiver_address : payout.receiver_address
  //       }
  //     };

  //     const notificationContent: NotificationContent = {
  //       type: NotificationType.Act_Fast,
  //  tags: ["Task", "Project"],

  //       notificationHeader: `Payout Assigned for ${task.title}`,
  //       notificationBody: `${payout.payout_amount} payout is assigned to ${payout.name} for the ${task.title} by ${member.name}`,
  //       metaData: PayoutAssignedDAONotificationnMetaData,
  //     };

  //     const notification: WebNotification = {
  //       notificationId: `${from.from}-${to.to.length}-${timestamp}`,
  //       notificationData: notificationPartialData,
  //       notificationStatus: NotificationStatus.Pending,
  //       notificationContent: notificationContent,
  //       timestamp: Date.now(),
  //       scope: NotificationScope.REVIEWS,
  //     };

  //     return notification;
  //   } catch (err: any) {
  //     console.log(err);
  //     return null;
  //   }
  // }

  KanbanBoardChangedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      let task;
      const arr: string[] = [];

      const jwt = generateJWT(from.from);

      const result = await axios.get(`${process.env.GATEWAY_URL}/api/project/contributor/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          projectid: metaData?.id!,
        },
      });
      const contributors = result.data.data.map((member: any) => member.member_id);
      to.to = contributors;

      const projectResult = await axios.get(`${process.env.GATEWAY_URL}/api/project/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
          projectid: metaData?.id!,
        },
      });
      const projectData = projectResult.data.data.project;

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const KanbanBoardChangedNotificationMetaData: KanbanBoardChangedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        project: {
          title: projectData.title,
          project_id: projectData.project_id,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Project Structure changed!`,
        notificationBody: `Dashboard structure of project ${projectData.title} updated by ${member.name} - Check it out!`,
        metaData: KanbanBoardChangedNotificationMetaData,
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

  TaskStatusChangedToCompletedNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      let task;
      let arr: string[] = [];

      const jwt = generateJWT(from.from);

      if (to.for === NotificationFor.ADMIN_MEMBER) {
        const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        task = taskResult.data.data;

        arr.push(task.poc_member_id);

        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoadmins = daoresult.data.data.admins;
        if (daoadmins) {
          arr = [...arr, ...daoadmins];
        }

        const projectresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_project`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const projectadmins = projectresult?.data?.data?.admins;
        if (projectadmins) {
          arr = [...arr, ...projectadmins];
        }

        const contributors = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const allContributors = contributors.data.data.contributors;
        if (allContributors) {
          arr = [...arr, ...allContributors];
        }

        const uniqueArray = [...new Set(arr)];

        to.to = uniqueArray;
      }

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskPostedAsJobOrBountyNotificationMetaData: TaskDeletedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Task completed`,
        notificationBody: `Task ${task.title} completed - Well done!`,
        metaData: TaskPostedAsJobOrBountyNotificationMetaData,
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

  CommentOnTaskNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      let task;
      let arr: string[] = [];

      const jwt = generateJWT(from.from);

      if (to.for === NotificationFor.ADMIN_MEMBER) {
        const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        task = taskResult.data.data;

        arr.push(task.poc_member_id);

        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoadmins = daoresult.data.data.admins;
        if (daoadmins) {
          arr = [...arr, ...daoadmins];
        }

        const projectresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_project`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const projectadmins = projectresult?.data?.data?.admins;
        if (projectadmins) {
          arr = [...arr, ...projectadmins];
        }

        const contributors = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const allContributors = contributors.data.data.contributors;
        if (allContributors) {
          arr = [...arr, ...allContributors];
        }

        const uniqueArray = [...new Set(arr)];

        to.to = uniqueArray;
      }

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskPostedAsJobOrBountyNotificationMetaData: TaskDeletedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Comment', 'Project'],
        popup: false,
        notificationHeader: `New comment`,
        notificationBody: `New comment on your task by ${member.name} - Keep the conversation going!`,
        metaData: TaskPostedAsJobOrBountyNotificationMetaData,
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

  AttachmentAddedToTask = async (notificationPartialData: NotificationPartialData): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      let task;
      let arr: string[] = [];

      const jwt = generateJWT(from.from);

      if (to.for === NotificationFor.ADMIN_MEMBER) {
        const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        task = taskResult.data.data;

        arr.push(task.poc_member_id);

        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoadmins = daoresult.data.data.admins;
        if (daoadmins) {
          arr = [...arr, ...daoadmins];
        }

        const projectresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_project`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const projectadmins = projectresult?.data?.data?.admins;
        if (projectadmins) {
          arr = [...arr, ...projectadmins];
        }

        const contributors = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const allContributors = contributors.data.data.contributors;
        if (allContributors) {
          arr = [...arr, ...allContributors];
        }

        const uniqueArray = [...new Set(arr)];

        to.to = uniqueArray;
      }

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskPostedAsJobOrBountyNotificationMetaData: TaskDeletedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Attachment', 'Project'],
        popup: true,
        notificationHeader: `Attachment Added`,
        notificationBody: `New attachment added for ${task.title} by ${member.name} - Check it out!`,
        metaData: TaskPostedAsJobOrBountyNotificationMetaData,
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

  TaskAssignedToContributorNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(from.from);

      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskAssignedToContributorNotificationMetaData: TaskAssignedToContributorNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
          contributors: task.assignee_member,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.MENTIONS,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Task Assigned`,
        notificationBody: `New task assigned to you by ${member.name} - Time to get to work!`,
        metaData: TaskAssignedToContributorNotificationMetaData,
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

  ContributorRemovedFromTaskContributorNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const jwt = generateJWT(from.from);

      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskAssignedToContributorNotificationMetaData: TaskAssignedToContributorNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
          contributors: task.assignee_member,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Contributor Removed`,
        notificationBody: `You have been removed from ${task.title} task by ${member.name} - Stay informed of changes!`,
        metaData: TaskAssignedToContributorNotificationMetaData,
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

  ContributorRemovedFromTaskDAONotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const user_removed_id = metaData?.extra?.user_removed_id as string;

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

      const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const task = taskResult.data.data;

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const removedUserDetails = await getMemberInfo(user_removed_id, jwt);
      const removedUser = removedUserDetails;

      const TaskAssignedToContributorNotificationMetaData: TaskAssignedToContributorNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
          contributors: task.assignee_member,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Contributor Removed`,
        notificationBody: `${removedUser} removed from task by ${member.name} - Stay informed of changes! `,
        metaData: TaskAssignedToContributorNotificationMetaData,
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

  EditInTaskNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      let task;
      let arr: string[] = [];

      const jwt = generateJWT(from.from);

      if (to.for === NotificationFor.ADMIN_MEMBER) {
        const taskResult = await axios.get(`${process.env.GATEWAY_URL}/api/notification/task/${metaData?.id}`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        task = taskResult.data.data;

        arr.push(task.poc_member_id);

        const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_dao`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const daoadmins = daoresult.data.data.admins;
        if (daoadmins) {
          arr = [...arr, ...daoadmins];
        }

        const projectresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/members/${to.to[0]}/manage_project`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const projectadmins = projectresult?.data?.data?.admins;
        if (projectadmins) {
          arr = [...arr, ...projectadmins];
        }

        const contributors = await axios.get(`${process.env.GATEWAY_URL}/api/member/get/all/contributors`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const allContributors = contributors.data.data.contributors;
        if (allContributors) {
          arr = [...arr, ...allContributors];
        }

        const uniqueArray = [...new Set(arr)];

        to.to = uniqueArray;
      }

      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const TaskPostedAsJobOrBountyNotificationMetaData: TaskDeletedNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        task: {
          title: task.title,
          task_id: task.task_id,
          project_id: task.project_id,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Task', 'Project'],
        popup: false,
        notificationHeader: `Edit in Notification`,
        notificationBody: `${task.title} details updated by ${member.name} - Don't miss out on important updates!`,
        metaData: TaskPostedAsJobOrBountyNotificationMetaData,
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

  ReviewNudgeContributorNotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;

      const dao_id = metaData?.id as string;

      const jwt = generateJWT(from.from);

      const daoresult = await axios.get(`${process.env.GATEWAY_URL}/api/dao/get/${dao_id}`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      const daoDetails = daoresult.data.data.dao;

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const daoPoc = await getMemberInfo(daoDetails.poc_member_id, jwt);
      const daoPocMember = daoPoc;

      const ReviewNudgeContributorNotificationMetaData: ReviewNudgeContributorNotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        dao: {
          dao_id: daoDetails.dao_id,
          name: daoDetails.name,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Review'],
        popup: true,
        notificationHeader: `Contributor Removed`,
        notificationBody: `Rate your experience with ${daoDetails.name} and ${daoPocMember?.username} now that the task is complete.`,
        metaData: ReviewNudgeContributorNotificationMetaData,
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

  ReviewNudgeDAONotification = async (
    notificationPartialData: NotificationPartialData,
  ): Promise<WebNotification | null> => {
    try {
      const { to, from, metaData, timestamp } = notificationPartialData;
      const dao_id: string = to.to[0];
      //console.log('taskReviewNotification', notificationPartialData);
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

      //User Info
      const memberResult = await getMemberInfo(from.from, jwt);
      const member = memberResult;

      const ReviewNudgeContributorNotificationMetaData: ReviewNudgeDAONotificationMetaData = {
        member: {
          member_id: member.member_id,
          username: member.username,
          profile_picture: member.profile_picture,
          name: member.name,
        },
        redirect_link: metaData?.redirect_link,
      };

      const notificationContent: NotificationContent = {
        type: NewNotificationType.ALL,
        tags: ['Review'],
        popup: true,
        notificationHeader: `Contributor Removed`,
        notificationBody: `Rate your experience with the contributors of the ${metaData?.extra?.taskTitle} which is now complete`,
        metaData: ReviewNudgeContributorNotificationMetaData,
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
}
