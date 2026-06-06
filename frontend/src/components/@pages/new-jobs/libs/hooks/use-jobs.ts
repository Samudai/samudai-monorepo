import {
    JobsEnums,
    OpportunityResponse,
    NotificationsEnums,
} from '@samudai_xyz/gateway-consumer-types';
import { useCallback, useEffect, useState } from 'react';
import {
    createApplicantRequest,
    createOpportunityRequest,
    updateOpportunityStatusRequest,
} from 'store/services/jobs/model';
import {
    useCreateApplicantMutation,
    useCreateOpportunityMutation,
    useDeleteOpportunityMutation,
    useGetPublicOpportunitiesQuery,
    useUpdateOpportunityMutation,
    useUpdateOpportunityStatusMutation,
} from 'store/services/jobs/totalJobs';
import sendNotification from 'utils/notification/sendNotification';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { JobsFilterInputs } from '../../ui/types';

export const useJobs = (noFetch?: boolean) => {
    const [opportunities, setOpportunities] = useState<OpportunityResponse[]>([]);

    const { data: jobData, isLoading: firstLoading } = useGetPublicOpportunitiesQuery(undefined, {
        skip: noFetch,
    });
    const memberId = getMemberId();
    const [createJob] = useCreateOpportunityMutation();
    const [updateJob] = useUpdateOpportunityMutation();
    const [updateStatus] = useUpdateOpportunityStatusMutation();
    const [deleteOpportunity] = useDeleteOpportunityMutation();
    const [addApplicant] = useCreateApplicantMutation();

    useEffect(() => {
        setOpportunities(jobData?.data.opportunities || []);
    }, [jobData]);

    const createOpportunity = async (data: createOpportunityRequest) => {
        await createJob(data)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully created', '')();
                sendNotification({
                    to: [],
                    for: NotificationsEnums.NotificationFor.MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: res?.data?.job_id || '',
                        redirect_link: `/jobs/tasks`,
                    },
                    type: NotificationsEnums.SocketEventsToServicePayment.JOB_POSTED_NOTIFICATION,
                });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to create job', '')();
            });
    };

    const updateOpportunity = async (data: createOpportunityRequest) => {
        await updateJob(data)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully updated', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to update job', '')();
            });
    };

    const getFilteredList = useCallback(
        (filter: JobsFilterInputs) => {
            let list = jobData?.data?.opportunities?.filter((item) => item.status !== 'archived');
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
                    if (!item.skills.length) return false;
                    item.skills.forEach((skill) => {
                        if (filter.tags.includes(skill)) check = true;
                    });
                    return check;
                });
            }
            return list;
        },
        [jobData]
    );

    const archiveOpportunity = async (jobId: string) => {
        const payload: updateOpportunityStatusRequest = {
            jobId,
            status: JobsEnums.JobStatus.ARCHIVED,
            updatedBy: memberId,
        };
        await updateStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully archived', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to archive job', '')();
            });
    };

    const unarchiveOpportunity = async (jobId: string) => {
        const payload: updateOpportunityStatusRequest = {
            jobId,
            status: JobsEnums.JobStatus.OPEN,
            updatedBy: memberId,
        };
        await updateStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully unarchived', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to unarchive job', '')();
            });
    };

    const removeOpportunity = async (jobId: string) => {
        await deleteOpportunity(jobId)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully deleted', '')();
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to delete job', '')();
            });
    };

    const createApplicant = async (data: createApplicantRequest) => {
        const opportunity = opportunities.find((i) => i.job_id === data.applicant.job_id);
        await addApplicant(data)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Successfully applied', '')();
                if (opportunity) {
                    sendNotification({
                        to: [opportunity.dao_id],
                        for: NotificationsEnums.NotificationFor.ADMIN,
                        from: memberId,
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: opportunity.task_id || '',
                            redirect_link: `/jobs/applicants/${data.applicant.job_id}/tasks`,
                        },
                        type: NotificationsEnums.SocketEventsToServiceJob.JOB_APPLICANT_SUBMITTED,
                    });
                }
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to apply', '')();
            });
    };

    return {
        isLoading: firstLoading,
        allOpportunities: opportunities,
        opportunities: opportunities.filter((item) => item.status === 'open'),
        archivedOpportunities: opportunities.filter((item) => item.status === 'archived'),
        getFilteredList,
        createOpportunity,
        createApplicant,
        updateOpportunity,
        archiveOpportunity,
        removeOpportunity,
        unarchiveOpportunity,
    };
};
