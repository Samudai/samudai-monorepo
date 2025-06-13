import {
    JobsEnums,
    OpportunityResponse,
    NotificationsEnums,
    AccessEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { useTypedSelector } from 'hooks/useStore';
import { useCallback, useEffect, useState } from 'react';
import { selectAccessList } from 'store/features/common/slice';
import { updateApplicantStatusRequest } from 'store/services/jobs/model';
import {
    useGetOpportunityByDAOIdBulkMutation,
    useLazyGetApplicantsByJobIdQuery,
    useLazyGetApplicantsByMemberIdQuery,
    useLazyGetOpportunityByIdQuery,
    useUpdateApplicantStatusMutation,
} from 'store/services/jobs/totalJobs';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { JobsFilterInputs } from '../../ui/types';

export interface ApplicantStatusRequest {
    jobData: OpportunityResponse;
    member_id: string;
    applicant_id: string;
}

export const useApplicants = (noFetch?: boolean) => {
    const [opportunities, setOpportunities] = useState<OpportunityResponse[]>([]);

    const [fetchJobs, { isLoading: firstLoading }] = useGetOpportunityByDAOIdBulkMutation();
    const memberId = getMemberId();
    const [fetchOpportunity] = useLazyGetOpportunityByIdQuery();
    const [fetchApplicants, { isLoading: applicantLoading }] = useLazyGetApplicantsByJobIdQuery();
    const [fetchApplicantsForMember, { data: applicantData, isLoading: secondLoading }] =
        useLazyGetApplicantsByMemberIdQuery();
    const [updateApplicantStatus] = useUpdateApplicantStatusMutation();
    const accessList = useTypedSelector(selectAccessList);

    const getFilteredList = useCallback(
        (filter: JobsFilterInputs) => {
            let list = [...opportunities];
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
        [opportunities]
    );

    const getOpportunityDetails = async (jobId: string) => {
        return await fetchOpportunity(jobId)
            .unwrap()
            .then((res) => {
                return res.data.opportunity;
            });
    };

    const getApplicants = async (jobId: string) => {
        return await fetchApplicants(jobId)
            .unwrap()
            .then((res) => {
                return res.data.applicants.members;
            });
    };

    const getApplicantsForMember = async (memberId: string) => {
        return await fetchApplicantsForMember(memberId)
            .unwrap()
            .then((res) => {
                return res.data.applicants;
            });
    };

    const acceptApplicant = async (data: ApplicantStatusRequest) => {
        const payload: updateApplicantStatusRequest = {
            jobAssociatedTaskId: data.jobData.task_id!,
            jobAssociatedProjectId: data.jobData.project_id!,
            applicant: {
                job_id: data.jobData.job_id,
                member_id: data.member_id,
                applicant_id: data.applicant_id,
                status: JobsEnums.ApplicantStatusType.ACCEPTED,
                updated_by: memberId,
            },
            type: 'member',
        };

        const opportunity = opportunities.find((i) => i.job_id === data.jobData.job_id);

        return await updateApplicantStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Applicant accepted', '')();
                if (!opportunity?.task_id) return;
                sendNotification({
                    to: [data.member_id],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: opportunity.task_id,
                        redirect_link: `/jobs/applied`,
                        extra: {
                            dao_id: opportunity.dao_id,
                        },
                    },
                    type: NotificationsEnums.SocketEventsToServiceJob.JOB_APPLICANT_ACCEPTED,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to accept applicant', '')();
            });
    };

    const rejectApplicant = async (data: ApplicantStatusRequest) => {
        const payload: updateApplicantStatusRequest = {
            jobAssociatedTaskId: data.jobData.task_id!,
            jobAssociatedProjectId: data.jobData.project_id!,
            applicant: {
                job_id: data.jobData.job_id,
                member_id: data.member_id,
                applicant_id: data.applicant_id,
                status: JobsEnums.ApplicantStatusType.REJECTED,
                updated_by: memberId,
            },
            type: 'member',
        };

        const opportunity = opportunities.find((i) => i.job_id === data.jobData.job_id);

        return await updateApplicantStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Applicant rejected', '')();
                if (!opportunity?.task_id) return;
                sendNotification({
                    to: [data.member_id],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: opportunity.task_id,
                        redirect_link: `/jobs/applied`,
                        extra: {
                            dao_id: opportunity.dao_id,
                        },
                    },
                    type: NotificationsEnums.SocketEventsToServiceJob.JOB_APPLICANT_REJECTED,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to reject applicant', '')();
            });
    };

    useEffect(() => {
        const dao_ids = Object.keys(accessList).filter(
            (daoid) =>
                accessList[daoid]?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
                accessList[daoid]?.includes(AccessEnums.AccessType.MANAGE_JOB)
        );
        if (dao_ids.length && !noFetch) {
            fetchJobs({ dao_ids })
                .unwrap()
                .then((res) => {
                    const newOpportunites: OpportunityResponse[] = [];
                    if (res.data && !!res.data.length) {
                        res.data.forEach((item: any) => {
                            if (item?.opportunities) {
                                item?.opportunities && newOpportunites.push(...item.opportunities);
                            }
                        });
                    }
                    setOpportunities(
                        newOpportunites.sort(function (a, b) {
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
        opportunities,
        applicantLoading,
        applicants: applicantData?.data.applicants,
        getFilteredList,
        getOpportunityDetails,
        getApplicants,
        acceptApplicant,
        rejectApplicant,
        getApplicantsForMember,
    };
};
