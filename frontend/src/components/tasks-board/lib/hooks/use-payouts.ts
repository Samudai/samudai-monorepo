import {
    useCreateBulkPayoutMutation,
    useCreatePayoutMutation,
    useDeletePayoutMutation,
    useUpdatePayoutMutation,
} from 'store/services/projects/totalProjects';
import { toast } from 'utils/toast';
import { IPayoutRequest } from 'store/services/projects/model';
import {
    useLazyGetSubTaskDetailsQuery,
    useLazyGetTaskDetailsQuery,
} from 'store/services/projects/tasks';
import { useState } from 'react';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import { NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { useTypedDispatch } from 'hooks/useStore';
import { updatePayoutList } from 'store/features/projects/projectSlice';
import sendNotification from 'utils/notification/sendNotification';
import { getMemberId } from 'utils/utils';
import { useParams } from 'react-router-dom';

interface IData {
    title: string;
    assignees: IMember[];
}

export const usePayouts = (link?: { type: 'task' | 'subtask'; id: string }) => {
    const [data, setData] = useState<IData>({
        title: '',
        assignees: [],
    });

    const { daoid, projectId } = useParams<{
        daoid: string;
        projectId: string;
    }>();
    const dispatch = useTypedDispatch();
    const [createPayout] = useCreatePayoutMutation();
    const [createBulkPayout] = useCreateBulkPayoutMutation();
    const [updatePayout] = useUpdatePayoutMutation();
    const [deletePayout] = useDeletePayoutMutation();
    const [getTaskDetails] = useLazyGetTaskDetailsQuery();
    const [getSubTaskDetails] = useLazyGetSubTaskDetailsQuery();
    const member_id = getMemberId();

    const fetchData = async () => {
        if (link && link.type === 'task') {
            getTaskDetails(link.id)
                .unwrap()
                .then((res) => {
                    dispatch(updatePayoutList(res.data?.payout || []));
                    setData({
                        title: res.data?.title || '',
                        assignees: res.data?.assignees || [],
                    });
                });
        } else if (link && link.type === 'subtask') {
            getSubTaskDetails(link.id)
                .unwrap()
                .then((res) => {
                    dispatch(updatePayoutList(res.data?.payout || []));
                    setData({
                        title: res.data?.title || '',
                        assignees: res.data?.assignees || [],
                    });
                });
        }
    };

    const addPayout = async (payout: IPayoutRequest) => {
        const payload = { payout };

        try {
            await createPayout(payload).unwrap();
            sendNotification({
                to: [payout.member_id],
                for: NotificationsEnums.NotificationFor.MEMBER,
                from: member_id,
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: payout.link_id,
                    redirect_link: `/${daoid}/projects/${projectId}/board`,
                },
                type: NotificationsEnums.SocketEventsToServiceProject.PAYOUT_ASSIGNED_CONTRIBUTOR,
            });
            sendNotification({
                to: [daoid!],
                for: NotificationsEnums.NotificationFor.ADMIN,
                from: member_id,
                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                metadata: {
                    id: payout.link_id,
                    redirect_link: `/${daoid}/projects/${projectId}/board`,
                },
                type: NotificationsEnums.SocketEventsToServiceProject.PAYOUT_ASSIGNED_DAO,
            });
            fetchData();
            toast('Success', 5000, 'Payout added successfully', '')();
        } catch (error) {
            toast('Failure', 5000, 'Failed to add payout', '')();
        }
    };

    const addBulkPayout = async (payouts: IPayoutRequest[]) => {
        const payload = { payouts };
        try {
            await createBulkPayout(payload).unwrap();
            payouts.forEach((payout) => {
                sendNotification({
                    to: [payout.member_id],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: member_id,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: payout.link_id,
                        redirect_link: `/${daoid}/projects/${projectId}/board`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceProject
                        .PAYOUT_ASSIGNED_CONTRIBUTOR,
                });
                sendNotification({
                    to: [daoid!],
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: member_id,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: payout.link_id,
                        redirect_link: `/${daoid}/projects/${projectId}/board`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceProject.PAYOUT_ASSIGNED_DAO,
                });
            });
            fetchData();
            toast('Success', 5000, 'Payout added successfully', '')();
        } catch (error) {
            toast('Failure', 5000, 'Failed to add payout', '')();
        }
    };

    const editPayout = async (payout: IPayoutRequest) => {
        const payload = { payout };

        try {
            await updatePayout(payload).unwrap();
            fetchData();
            toast('Success', 5000, 'Payout updated successfully', '')();
        } catch (error) {
            toast('Failure', 5000, 'Failed to update payout', '')();
        }
    };

    const removePayout = async (payoutId: string) => {
        try {
            await deletePayout(payoutId).unwrap();
            fetchData();
            toast('Success', 5000, 'Payout removed successfully', '')();
        } catch (error) {
            toast('Failure', 5000, 'Failed to remove payout', '')();
        }
    };

    return {
        data,
        addPayout,
        addBulkPayout,
        editPayout,
        removePayout,
        fetchData,
    };
};
