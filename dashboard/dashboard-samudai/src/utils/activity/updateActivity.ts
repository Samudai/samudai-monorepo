import { Activity } from '@samudai_xyz/gateway-consumer-types';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import store from 'store/store';
import { sendActivityUpdate } from './sendActivityUpdate';

export declare type ActionObj = {
    message: string;
};

const getAction = (data: Activity) => {
    const username: any = store.getState().commonReducer.userName;

    // Task
    if (data.action_type === ActivityEnums.ActionType.TASK_CREATED) {
        return `${username} created a new task: ${data.metadata?.title} `;
    }
    if (data.action_type === ActivityEnums.ActionType.TASK_UPDATED) {
        return `${username} updated task: ${data.metadata?.title} from ${data.metadata?.from} to ${data.metadata?.to}`;
    }

    // Project
    if (data.action_type === ActivityEnums.ActionType.PROJECT_CREATED) {
        return `${username} created project: ${data.metadata?.title || ''} `;
    }
    if (data.action_type === ActivityEnums.ActionType.PROJECT_UPDATED) {
        return `${username} updated project: ${data.metadata?.title || ''} `;
    }
    if (data.action_type === ActivityEnums.ActionType.PROJECT_ACCESS_UPDATED) {
        return `${username} updated access for project: ${data.metadata?.title || ''} `;
    }

    // Reviews
    if (data.action_type === ActivityEnums.ActionType.REVIEW_ADDED) {
        return `${username} added Review `;
    }

    // Integrations
    if (data.action_type === ActivityEnums.ActionType.SNAPSHOT_ADDED) {
        return `${username} added Snapshot connection `;
    }
    if (data.action_type === ActivityEnums.ActionType.SNAPSHOT_UPDATED) {
        return `${username} updated Snapshot connection `;
    }

    if (data.action_type === ActivityEnums.ActionType.ABOUT_ADDED) {
        return `${username} updated About Dao `;
    }

    if (data.action_type === ActivityEnums.ActionType.GITHUB_ADDED) {
        return `${username} added Github connection `;
    }
    if (data.action_type === ActivityEnums.ActionType.GITHUB_UPDATED) {
        return `${username} updated Github connection `;
    }

    if (data.action_type === ActivityEnums.ActionType.GCAL_ADDED) {
        return `${username} added Google Calendar connection `;
    }
    if (data.action_type === ActivityEnums.ActionType.GCAL_UPDATED) {
        return `${username} updated Google Calendar connection `;
    }
    if (data.action_type === ActivityEnums.ActionType.GCAL_EVENT_CREATED) {
        return `${username} created a new Google Calendar event ${
            data.metadata?.event_title || ''
        }`;
    }

    if (data.action_type === ActivityEnums.ActionType.TWITTER_ADDED) {
        return `${username} updated Twitter connection `;
    }
    if (data.action_type === ActivityEnums.ActionType.TWITTER_UPDATED) {
        return `${username} updated Twitter connection `;
    }

    // similarly for Gcal, twitter, etc

    // Blogs
    if (data.action_type === ActivityEnums.ActionType.BLOG_ADDED) {
        return `${username} Added Blogs `;
    }
    if (data.action_type === ActivityEnums.ActionType.BLOG_UPDATED) {
        return `${username} Added Blogs `;
    }

    // Discussions
    if (data.action_type === ActivityEnums.ActionType.DISCUSSION_ADDED) {
        return `${username} created a new Discussion: ${data.metadata?.title || ''} `;
    }
    if (data.action_type === ActivityEnums.ActionType.DISCUSSION_UPDATED) {
        return `${username} updated discussion: ${data.metadata?.title || ''} `;
    }

    // Access
    if (data.action_type === ActivityEnums.ActionType.DAO_ACCESS_UPDATED) {
        return `${username} updated Access for DAO `;
    }

    // Common Access
    if (data.action_type === ActivityEnums.ActionType.PROJECT_COMMON_ACCESS_UPDATED) {
        return `${username} updated Access for Manage Project across DAO `;
    }
    if (data.action_type === ActivityEnums.ActionType.TASK_COMMON_ACCESS_UPDATED) {
        return `${username} updated Access for Manage Task across DAO `;
    }
    if (data.action_type === ActivityEnums.ActionType.VIEW_COMMON_ACCESS_UPDATED) {
        return `${username} updated view Access for DAO `;
    }

    // Connections
    if (data.action_type === ActivityEnums.ActionType.CONNECTION_SENT) {
        return `${username} sent Connection Request to ${data.metadata?.to || ''} `;
    }
    if (data.action_type === ActivityEnums.ActionType.CONNECTION_ACCEPTED) {
        return `${username} accepted Connection Request ${data.metadata?.from || ''} `;
    }
    if (data.action_type === ActivityEnums.ActionType.CONNECTION_REJECTED) {
        return `${username} rejected Connection Request ${data.metadata?.from || ''} `;
    }

    if (data.action_type === ActivityEnums.ActionType.CONTRIBUTOR_ADDED_TO_TASK) {
        return `${username} added new members to task: ${data.metadata?.title || ''} `;
    }
    if (data.action_type === ActivityEnums.ActionType.CONTRIBUTOR_ADDED_TO_PROJECT) {
        return `${username} added new members to project: ${data.metadata?.title || ''} `;
    }

    if (data.action_type === ActivityEnums.ActionType.VIEW_CREATED) {
        return `${username} created a new View: ${data.metadata?.view_name} `;
    }
    if (data.action_type === ActivityEnums.ActionType.VIEW_DELETED) {
        return `${username} deleted View ${data.metadata?.view_name}`;
    }
    if (data.action_type === ActivityEnums.ActionType.VIEW_RENAMED) {
        return `${username} renamed a View ${data.metadata?.old_view} to ${data.metadata?.new_view}`;
    }
};

// const getExtras = (type: RequestType, extras: any) => {
//   if (type === RequestType.TASK) {
//     return {
//       taskId: extras.task_id,
//       projectId: extras.project_id,
//     };
//   }
// };

export const updateActivity: {
    (data: {
        dao_id: string;
        member_id: string;
        project_id?: string;
        task_id?: string;
        subtask_id?: string;
        discussion_id?: string;
        job_id?: string;
        payment_id?: string;
        bounty_id?: string;
        action_type: ActivityEnums.ActionType;
        visibility: ActivityEnums.Visibility;
        member: {
            username: string;
            profile_picture: string;
        };
        dao: {
            dao_name: string;
            profile_picture: string;
        };
        project?: {
            project_name: string;
        };
        task?: {
            task_name: string;
        };
        subtask?: {
            subtask_name: string;
        };
        action: {
            message: string;
        };
        metadata?: {
            [key: string]: any;
        };
    }): void;
} = (data: any) => {
    let payload = {} as Activity;
    payload = data;
    payload.action.message = getAction(data)!;
    console.log('activity', payload);
    sendActivityUpdate(payload);
};
