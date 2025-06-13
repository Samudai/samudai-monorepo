import { useEffect, useState } from 'react';
import {
    JobsEnums,
    NotificationsEnums,
    OpportunityResponse,
} from '@samudai_xyz/gateway-consumer-types/dist/types';
import { JobsFilterInputs } from '../../ui/types';
import { getMemberId, getQueryParam } from 'utils/utils';
import {
    useCreateApplicantMutation,
    useCreateOpportunityMutation,
    useDeleteOpportunityMutation,
    useLazyGetPublicOpportunitiesQuery,
    useUpdateOpportunityMutation,
    useUpdateOpportunityStatusMutation,
} from 'store/services/jobs/totalJobs';
import { toast } from 'utils/toast';
import {
    createApplicantRequest,
    createOpportunityRequest,
    updateOpportunityStatusRequest,
} from 'store/services/jobs/model';
import sendNotification from 'utils/notification/sendNotification';

export const usePaginatedJobs = (filter: JobsFilterInputs) => {
    const [opportunities, setOpportunities] = useState<OpportunityResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [page, setPage] = useState({
        number: 1,
        isLoading: false,
        noFetch: false,
    });

    const memberId = getMemberId();

    const [getPublicOpportunities] = useLazyGetPublicOpportunitiesQuery();
    const [createJob] = useCreateOpportunityMutation();
    const [updateJob] = useUpdateOpportunityMutation();
    const [updateStatus] = useUpdateOpportunityStatusMutation();
    const [deleteOpportunity] = useDeleteOpportunityMutation();
    const [addApplicant] = useCreateApplicantMutation();

    const getOpportunityQueryParam = (filter: JobsFilterInputs, pageNo: number) => {
        return getQueryParam({
            skills: filter.tags,
            daoNames: filter.dao_names,
            query: filter.search,
            page: pageNo,
        });
    };

    const fetchOpportunities = async () => {
        if (filter.search.length > 0 && filter.search.length < 2) return;
        try {
            const res = await getPublicOpportunities(getOpportunityQueryParam(filter, 1)).unwrap();
            if (page.number === 1) {
                setOpportunities(res?.data?.opportunities || []);
                setPage((page) => ({
                    ...page,
                    isLoading: false,
                    noFetch: !res?.data?.opportunities,
                }));
            } else {
                setOpportunities((prevData) => [...prevData, ...res.data.opportunities]);
                setPage((page) => ({
                    ...page,
                    isLoading: false,
                    noFetch: !res?.data?.opportunities,
                }));
            }
        } catch (err) {
            console.log(err);
            toast('Failure', 5000, 'Error in fetching Jobs', '');
        } finally {
            setLoading(false);
        }
    };

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
                setPage((page) => ({ ...page, number: 1, noFetch: false, isLoading: false }));
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to create job', '')();
            });
    };

    const updateOpportunity = async (data: createOpportunityRequest) => {
        const oldData = [...opportunities];
        const newData = oldData.map((opportunity) => {
            if (opportunity.job_id === data.opportunity.job_id) {
                return data.opportunity as any;
            } else {
                return opportunity;
            }
        });
        await updateJob(data)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully updated', '')();
                setOpportunities(newData);
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to update job', '')();
            });
    };

    const removeOpportunity = async (jobId: string) => {
        const oldData = [...opportunities];
        const newData = oldData.filter((opportunity) => opportunity.job_id !== jobId);
        await deleteOpportunity(jobId)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully deleted', '')();
                setOpportunities(newData);
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to delete job', '')();
            });
    };

    const archiveOpportunity = async (jobId: string) => {
        const payload: updateOpportunityStatusRequest = {
            jobId,
            status: JobsEnums.JobStatus.ARCHIVED,
            updatedBy: memberId,
        };
        const oldData = [...opportunities];
        const newData = oldData.map((opportunity) => {
            if (opportunity.job_id === jobId) {
                return { ...opportunity, status: JobsEnums.JobStatus.ARCHIVED };
            } else {
                return opportunity;
            }
        });
        await updateStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully archived', '')();
                setOpportunities(newData);
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
        const oldData = [...opportunities];
        const newData = oldData.map((opportunity) => {
            if (opportunity.job_id === jobId) {
                return { ...opportunity, status: JobsEnums.JobStatus.OPEN };
            } else {
                return opportunity;
            }
        });
        await updateStatus(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Job is successfully unarchived', '')();
                setOpportunities(newData);
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to unarchive job', '')();
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

    useEffect(() => {
        setPage((page) => ({ ...page, number: 1, noFetch: false, isLoading: false }));
        fetchOpportunities();
    }, [filter]);

    useEffect(() => {
        if (!loading) {
            fetchOpportunities();
        }
    }, [page.number]);

    return {
        isLoading: loading,
        allOpportunities: opportunities,
        opportunities: opportunities.filter((item) => item.status === 'open'),
        archivedOpportunities: opportunities.filter((item) => item.status === 'archived'),
        setLoading,
        createOpportunity,
        createApplicant,
        updateOpportunity,
        archiveOpportunity,
        removeOpportunity,
        unarchiveOpportunity,
    };
};
