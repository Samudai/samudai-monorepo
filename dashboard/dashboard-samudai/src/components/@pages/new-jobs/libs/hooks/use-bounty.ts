import { BountyResponse, JobsEnums, NotificationsEnums } from '@samudai_xyz/gateway-consumer-types';
import { useCallback, useEffect, useState } from 'react';
import {
    createBountyRequest,
    createSubmissionRequest,
    updateBountyStatusRequest,
} from 'store/services/jobs/model';
import {
    useCreateBountyMutation,
    useCreateSubmissionMutation,
    useGetOpenBountiesQuery,
    useUpdateBountyMutation,
    useUpdateBountyStatusMutation,
    useDeleteBountyMutation,
} from 'store/services/jobs/totalJobs';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { JobsFilterInputs } from '../../ui/types';

export const useBounty = (noFetch?: boolean) => {
    const [bountyList, setBountyList] = useState<BountyResponse[]>([]);

    const { data: bountyData, isLoading: firstLoading } = useGetOpenBountiesQuery(undefined, {
        skip: noFetch,
    });
    const memberId = getMemberId();
    const [createJob] = useCreateBountyMutation();
    const [updateJob] = useUpdateBountyMutation();
    const [updateStatus] = useUpdateBountyStatusMutation();
    const [deleteStatus] = useDeleteBountyMutation();
    const [addSubmission] = useCreateSubmissionMutation();

    useEffect(() => {
        setBountyList(bountyData?.data.bounty || []);
    }, [bountyData]);

    const createBounty = async (data: createBountyRequest) => {
        await createJob(data)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Bounty is successfully created', '')();
                if (!res?.data?.bounty_id) return;
                sendNotification({
                    to: [],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res.data.bounty_id,
                        redirect_link: `/jobs/bounty`,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment
                        .BOUNTY_POSTED_NOTIFICATION,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to create bounty', '')();
            });
    };

    const updateBounty = async (data: createBountyRequest) => {
        await updateJob(data)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Bounty is successfully updated', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to update bounty', '')();
            });
    };

    const getFilteredList = useCallback(
        (filter: JobsFilterInputs) => {
            let list = bountyData?.data?.bounty?.filter((item) => item.status !== 'archived');
            if (!list?.length) {
                return [];
            }
            if (filter.search) {
                list = list.filter((item) =>
                    item.title.toLowerCase().includes(filter.search.toLowerCase())
                );
            }
            if (filter.dao_names.length) {
                list = list.filter((item) => filter.dao_names.includes(item.dao_name));
            }
            if (filter.tags.length) {
                let check = false;
                list = list.filter((item) => {
                    if (!item.skills?.length) return false;
                    item.skills.forEach((skill) => {
                        if (filter.tags.includes(skill)) check = true;
                    });
                    return check;
                });
            }
            return list;
        },
        [bountyData]
    );

    const archiveBounty = async (bountyId: string) => {
        const payload: updateBountyStatusRequest = {
            bountyId,
            status: JobsEnums.JobStatus.ARCHIVED,
            updatedBy: memberId,
        };
        await updateStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Bounty is successfully archived', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to archive bounty', '')();
            });
    };

    const unarchiveBounty = async (bountyId: string) => {
        const payload: updateBountyStatusRequest = {
            bountyId,
            status: JobsEnums.JobStatus.OPEN,
            updatedBy: memberId,
        };
        await updateStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Bounty is successfully unarchived', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to unarchive bounty', '')();
            });
    };

    const removeBounty = async (bountyId: string) => {
        await deleteStatus(bountyId)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Bounty is successfully deleted', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to delete bounty', '')();
            });
    };

    const createSubmission = async (data: createSubmissionRequest) => {
        await addSubmission(data)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Successfully applied', '')();
                const bounty = bountyList.find((i) => i.bounty_id === data.submission.bounty_id);
                if (!bounty?.dao_id || res?.data?.submission_id) return;
                sendNotification({
                    to: [bounty.dao_id],
                    for: NotificationsEnums.NotificationFor.ADMIN,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res.data.submission_id,
                        redirect_link: `/jobs/applicants/${data.submission.bounty_id}/bounty`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceJob.BOUNTY_SUBMITTED,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to apply', '')();
            });
    };

    return {
        isLoading: firstLoading,
        allBounties: bountyList,
        bountyList: bountyList?.filter((item) => item.status === 'open'),
        archivedBounties: bountyList?.filter((item) => item.status === 'archived'),
        getFilteredList,
        createBounty,
        createSubmission,
        updateBounty,
        removeBounty,
        archiveBounty,
        unarchiveBounty,
    };
};
