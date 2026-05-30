import {
    AccessEnums,
    BountyResponse,
    JobsEnums,
    NotificationsEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { useTypedSelector } from 'hooks/useStore';
import { useCallback, useEffect, useState } from 'react';
import { selectAccessList } from 'store/features/common/slice';
import { reviewSubmissionRequest } from 'store/services/jobs/model';
import {
    useLazyGetSubmissionsByBountyIdQuery,
    useGetBountiesByDAOIdBulkMutation,
    useLazyGetBountyByIdQuery,
    useReviewSubmissionMutation,
    useLazyGetSubmissionsByMemberIdQuery,
} from 'store/services/jobs/totalJobs';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { JobsFilterInputs } from '../../ui/types';

export interface SubmissionRequest {
    submission_id: string;
    member_id: string;
    bounty_id: string;
    feedback?: string;
    rank?: number;
}

export const useSubmissions = (noFetch?: boolean) => {
    const [bountyList, setBountyList] = useState<BountyResponse[]>([]);

    const [fetchBounties, { isLoading: firstLoading }] = useGetBountiesByDAOIdBulkMutation();
    const memberId = getMemberId();
    const [fetchBounty] = useLazyGetBountyByIdQuery();
    const [fetchSubmissions, { isLoading: submissionLoading }] =
        useLazyGetSubmissionsByBountyIdQuery();
    const [reviewSubmission] = useReviewSubmissionMutation();
    const [fetchSubmissionsForMember, { data: submissionData, isLoading: secondLoading }] =
        useLazyGetSubmissionsByMemberIdQuery();
    const accessList = useTypedSelector(selectAccessList);

    const getFilteredList = useCallback(
        (filter: JobsFilterInputs) => {
            let list = [...bountyList];
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
        [bountyList]
    );

    const getBountyDetails = async (bountyId: string) => {
        return await fetchBounty(bountyId)
            .unwrap()
            .then((res) => {
                return res.data.bounty;
            });
    };

    const getSubmissions = async (bountyId: string) => {
        return await fetchSubmissions(bountyId)
            .unwrap()
            .then((res) => {
                return res.data.submissions.clans;
            });
    };

    const getSubmissionsForMember = async (memberId: string) => {
        return await fetchSubmissionsForMember(memberId)
            .unwrap()
            .then((res) => {
                return res.data.submissions;
            });
    };

    const acceptSubmission = async (data: SubmissionRequest) => {
        const payload: reviewSubmissionRequest = {
            submission: {
                ...data,
                status: JobsEnums.ApplicantStatusType.ACCEPTED,
                updated_by: memberId,
            },
        };

        return await reviewSubmission(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Submission accepted', '')();
                sendNotification({
                    to: [data.member_id],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: data.submission_id,
                        redirect_link: `/jobs/applied`,
                        extra: {
                            dao_id:
                                bountyList.find((i) => i.bounty_id === data.bounty_id)?.dao_id ||
                                '',
                        },
                    },
                    type: NotificationsEnums.SocketEventsToServiceJob.BOUNTY_REWARDED,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to accept submission', '')();
            });
    };

    const rejectSubmission = async (data: SubmissionRequest) => {
        const payload: reviewSubmissionRequest = {
            submission: {
                ...data,
                status: JobsEnums.ApplicantStatusType.REJECTED,
                updated_by: memberId,
            },
        };

        return await reviewSubmission(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Submission rejected', '')();
                sendNotification({
                    to: [data.member_id],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: data.submission_id,
                        redirect_link: `/jobs/applied`,
                        extra: {
                            dao_id:
                                bountyList.find((i) => i.bounty_id === data.bounty_id)?.dao_id ||
                                '',
                        },
                    },
                    type: NotificationsEnums.SocketEventsToServiceJob.BOUNTY_SUBMISSION_REJECTED,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to reject submission', '')();
            });
    };

    useEffect(() => {
        const dao_ids = Object.keys(accessList).filter(
            (daoid) =>
                accessList[daoid]?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
                accessList[daoid]?.includes(AccessEnums.AccessType.MANAGE_JOB)
        );
        if (dao_ids.length && !noFetch) {
            fetchBounties({ dao_ids })
                .unwrap()
                .then((res) => {
                    const newBounties: BountyResponse[] = [];
                    if (res.data && !!res.data.length) {
                        res.data.forEach((item: any) => {
                            item?.bounty && newBounties.push(...item.bounty);
                        });
                    }
                    setBountyList(
                        newBounties.sort(function (a, b) {
                            const t1 = Date.parse(a.created_at!);
                            const t2 = Date.parse(b.created_at!);
                            return t2 - t1;
                        })
                    );
                });
        }
    }, [accessList, noFetch]);

    return {
        isLoading: firstLoading || secondLoading,
        bountyList,
        submissions: submissionData?.data.submissions,
        submissionLoading,
        getFilteredList,
        getBountyDetails,
        getSubmissions,
        acceptSubmission,
        rejectSubmission,
        getSubmissionsForMember,
    };
};
