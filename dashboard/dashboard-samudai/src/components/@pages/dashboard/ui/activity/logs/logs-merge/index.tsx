import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { mockup_users } from 'root/mockup/users';
import { LogHead, LogItem } from '../ui';

interface LogMergeProps {
    data: any;
}

export const returnData = (data: any, username: string) => {
    // Task
    if (data.action_type === ActivityEnums.ActionType.TASK_CREATED) {
        return (
            <>
                <span data-lavender>{username}</span> created a new task:{' '}
                <span data-orange>{data.metadata?.title}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.TASK_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated task:{' '}
                <span data-orange>
                    {data.metadata?.title} from {data.metadata?.from} to {data.metadata?.to}
                </span>
            </>
        );
    }

    // Project
    if (data.action_type === ActivityEnums.ActionType.PROJECT_CREATED) {
        return (
            <>
                <span data-lavender>{username}</span> created project:{' '}
                <span data-orange>{data.metadata?.title || ''}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.PROJECT_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated project:{' '}
                <span data-orange> {data.metadata?.title || ''}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.PROJECT_ACCESS_UPDATED) {
        return (
            <>
                <span data-lavender> {username}</span> updated access for project:{' '}
                <span data-orange> {data.metadata?.title || ''}</span>
            </>
        );
    }

    // Reviews
    if (data.action_type === ActivityEnums.ActionType.REVIEW_ADDED) {
        return (
            <>
                <span data-lavender>{username}</span> added Review
            </>
        );
    }

    // Integrations
    if (data.action_type === ActivityEnums.ActionType.SNAPSHOT_ADDED) {
        return (
            <>
                <span data-lavender>{username} </span>
                added Snapshot connection
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.SNAPSHOT_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Snapshot connection
            </>
        );
    }

    if (data.action_type === ActivityEnums.ActionType.ABOUT_ADDED) {
        return (
            <>
                <span data-lavender>{username}</span> updated About Dao
            </>
        );
    }

    if (data.action_type === ActivityEnums.ActionType.GITHUB_ADDED) {
        return (
            <>
                <span data-lavender>{username}</span> added Github connection
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.GITHUB_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Github connection
            </>
        );
    }

    if (data.action_type === ActivityEnums.ActionType.GCAL_ADDED) {
        return (
            <>
                <span data-lavender>{username}</span> added Google Calendar connection
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.GCAL_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Google Calendar connection
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.GCAL_EVENT_CREATED) {
        return (
            <>
                <span data-lavender>${username}</span> created a new Google Calendar event{' '}
                <span data-orange>${data.metadata?.event_title || ''}</span>
            </>
        );
    }

    if (data.action_type === ActivityEnums.ActionType.TWITTER_ADDED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Twitter connection
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.TWITTER_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Twitter connection
            </>
        );
    }

    // similarly for Gcal, twitter, etc

    // Blogs
    if (data.action_type === ActivityEnums.ActionType.BLOG_ADDED) {
        return (
            <>
                <span data-lavender>{username}</span> Added Blogs
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.BLOG_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> Added Blogs
            </>
        );
    }

    // Discussions
    if (data.action_type === ActivityEnums.ActionType.DISCUSSION_ADDED) {
        return (
            <>
                <span data-lavender>{username}</span> created a new Discussion:
                <span data-orange>{data.metadata?.title || ''}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.DISCUSSION_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated discussion:{' '}
                <span data-orange>{data.metadata?.title || ''}</span>{' '}
            </>
        );
    }

    // Access
    if (data.action_type === ActivityEnums.ActionType.DAO_ACCESS_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Access for DAO
            </>
        );
    }

    // Common Access
    if (data.action_type === ActivityEnums.ActionType.PROJECT_COMMON_ACCESS_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Access for Manage Project across DAO
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.TASK_COMMON_ACCESS_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated Access for Manage Task across DAO
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.VIEW_COMMON_ACCESS_UPDATED) {
        return (
            <>
                <span data-lavender>{username}</span> updated view Access for DAO
            </>
        );
    }

    // Connections
    if (data.action_type === ActivityEnums.ActionType.CONNECTION_SENT) {
        return (
            <>
                <span data-lavender>{username}</span> sent Connection Request to{' '}
                <span data-orange>{data.metadata?.to || ''}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.CONNECTION_ACCEPTED) {
        return (
            <>
                <span data-lavender>{username}</span> accepted Connection Request{' '}
                <span data-orange>{data.metadata?.from || ''}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.CONNECTION_REJECTED) {
        return (
            <>
                <span data-lavender>{username}</span> rejected Connection Request{' '}
                <span data-orange>{data.metadata?.from || ''}</span>{' '}
            </>
        );
    }

    if (data.action_type === ActivityEnums.ActionType.CONTRIBUTOR_ADDED_TO_TASK) {
        return (
            <>
                <span data-lavender>{username}</span> added new members to task:{' '}
                <span data-orange>{data.metadata?.title || ''}</span>{' '}
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.CONTRIBUTOR_ADDED_TO_PROJECT) {
        return (
            <>
                <span data-lavender>{username}</span> added new members to project:{' '}
                <span data-orange>{data.metadata?.title || ''}</span>
            </>
        );
    }

    if (data.action_type === ActivityEnums.ActionType.VIEW_CREATED) {
        return (
            <>
                <span data-lavender>{username}</span> created new View:{' '}
                <span data-orange>{data.metadata?.view_name || ''}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.VIEW_RENAMED) {
        return (
            <>
                <span data-lavender>{username}</span> renamed View:{' '}
                <span data-orange>{data.metadata?.old_view || ''}</span>
                <span> to </span>
                <span data-orange>{data.metadata?.new_view || ''}</span>
            </>
        );
    }
    if (data.action_type === ActivityEnums.ActionType.VIEW_DELETED) {
        return (
            <>
                <span data-lavender>{username}</span> Deleted View:{' '}
                <span data-orange>{data.metadata?.view_name || ''}</span>
            </>
        );
    }
};

export const LogMerge: React.FC<LogMergeProps> = ({ data }) => {
    return (
        <LogItem icon={'/img/icons/activity-doc.svg'}>
            <LogHead user={mockup_users[2]} data={data}>
                {/* Task <span data-lavender>{data?.task?.task_name}</span> merged with{' '}
        <span data-orange>#45890</span> in {data?.project?.project_name} */}
                {returnData(data, data?.member.username)}
            </LogHead>
        </LogItem>
    );
};
