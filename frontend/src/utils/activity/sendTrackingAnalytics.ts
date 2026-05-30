import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types/';
import mixpanel from 'mixpanel-browser';
import store from 'store/store';
import { getMemberId } from 'utils/utils';

export type UserActivityRequest = {
    page_id?: string;
    parent_id?: string;
    element_id?: string;
    project_id?: string;
    task_id?: string;
    subtask_id?: string;
    discussion_id?: string;
    job_id?: string;
    payment_id?: string;
    bounty_id?: string;
    action_type?: ActivityEnums.ActionType;
};

export type EventAnalyticsPayload = {
    type: 'GET' | 'POST';
    endpoint: string;
    endpointName: string;
    data?: any;
    response: any;
    args?: any;
    fulfilled: boolean;
};

const RequestType = {
    USER_ACTIVITY: 'User Activity',
} as const;

const TrackingActionType = {
    CLICK: 'Click',
    SUBMIT: 'Submit',
    VIEW: 'View',
} as const;

interface AnalyticsProps {
    action?: 'Click' | 'Submit' | 'View' | 'Close';
    type?: 'User Activity';
    data: UserActivityRequest;
    extras?: any;
}

// action: TrackingActionType,
// type: RequestType,

export const sendTrackingAnalytics = async ({
    action = TrackingActionType.CLICK,
    type = RequestType.USER_ACTIVITY,
    data,
    extras,
}: AnalyticsProps): Promise<void> => {
    const daoId = store.getState().commonReducer.activeDao;
    const daoName = store.getState().commonReducer.activeDaoName;
    const memberWalletAddress = store.getState().commonReducer.member?.data?.default_wallet_address;
    const memberUsername = store.getState().commonReducer.member?.data?.username;
    const memberId = getMemberId();
    const { sessionId } = JSON.parse(localStorage.getItem('session') || '{}');

    console.log('sendTrackingAnalytics', action, type, data, extras);
    window.analytics.track(type, {
        action: action, // The specific action performed by the user (e.g., click, submit, view)
        page_id: data?.page_id || '', // ID of the page where action occurred
        parent_id: data?.parent_id || '', // ID of the parent element of the clicked/interacted element
        element_id: data.element_id, // ID of the clicked/interacted element

        dao_id: daoId,
        member_id: memberId,
        member_username: memberUsername,
        member_default_wallet: memberWalletAddress,
        dao_name: daoName,
        session_id: sessionId,

        project_id: data?.project_id || '',
        task_id: data?.task_id || '',
        subtask_id: data?.subtask_id || '',
        discussion_id: data?.discussion_id || '',
        job_id: data?.job_id || '',
        payment_id: data?.payment_id || '',
        bounty_id: data?.bounty_id || '',
        metadata: {
            payload: extras?.payload || '',
        },
    });

    mixpanel.track(data.element_id!, {
        action: action, // The specific action performed by the user (e.g., click, submit, view)
        page_id: data?.page_id || '', // ID of the page where action occurred
        parent_id: data?.parent_id || '', // ID of the parent element of the clicked/interacted element
        element_id: data.element_id, // ID of the clicked/interacted element

        dao_id: daoId,
        member_id: memberId,
        member_username: memberUsername,
        member_default_wallet: memberWalletAddress,
        dao_name: daoName,
        session_id: sessionId,

        project_id: data?.project_id || '',
        task_id: data?.task_id || '',
        subtask_id: data?.subtask_id || '',
        discussion_id: data?.discussion_id || '',
        job_id: data?.job_id || '',
        payment_id: data?.payment_id || '',
        bounty_id: data?.bounty_id || '',
        metadata: {
            payload: extras?.payload || '',
        },
    });
};

export const sendEventAnalytics = async (data: EventAnalyticsPayload): Promise<void> => {
    const daoId = store.getState().commonReducer.activeDao;
    const daoName = store.getState().commonReducer.activeDaoName;
    const memberWalletAddress = store.getState().commonReducer.member?.data?.default_wallet_address;
    const memberUsername = store.getState().commonReducer.member?.data?.username;
    const memberId = getMemberId();
    const { sessionId } = JSON.parse(localStorage.getItem('session') || '{}');

    window.analytics.track('User Events', {
        dao_id: daoId,
        member_id: memberId,
        member_username: memberUsername,
        member_default_wallet: memberWalletAddress,
        dao_name: daoName,
        session_id: sessionId,
        endpoint_name: data.endpointName,
        data: JSON.stringify(data),
    });
};
