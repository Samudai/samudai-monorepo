import React, { useCallback, useEffect, useState } from 'react';
import { Applicant, JobsEnums } from '@samudai_xyz/gateway-consumer-types';
import { selectTrialDashboard } from 'store/features/Onboarding/slice';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import {
    JobsAddModal,
    JobsCard,
    JobsHeader,
    useApplicants,
    useFavourites,
    useJobs,
} from 'components/@pages/new-jobs';
import { useJobsFilter } from 'components/@pages/new-jobs/libs/hooks/use-jobs-filter';
import { JobsViewModal } from 'components/@pages/new-jobs/ui/jobs-view-modal';
import { ConnectDiscordModal } from 'components/@pages/new-onboarding';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import { getMemberId } from 'utils/utils';
import css from './jobs.module.scss';
import { filterUniqueRanks } from 'components/@pages/projects/ui/projects-post-job';

interface JobsProps {}

const Jobs: React.FC<JobsProps> = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([]);

    const { filter, setFilter } = useJobsFilter();
    const { getFilteredList, archiveOpportunity, removeOpportunity } = useJobs();
    const { FavouriteOpportunity, favOpportunityList, DeleteOpportunity } = useFavourites();
    const { applicants: newApplicants, isLoading, getApplicantsForMember } = useApplicants(true);
    const memberId = getMemberId();

    const addModal = usePopup();
    const editModal = usePopup<{
        data: any;
    }>();
    const viewModal = usePopup<{
        data: any;
        apply_tab: boolean;
        type: 'task' | 'bounty';
        status?: JobsEnums.ApplicantStatusType;
        closed?: boolean;
    }>();
    const discordModal = usePopup();
    const trialDashboard = useTypedSelector(selectTrialDashboard);

    const fetchApplicants = async () => {
        await getApplicantsForMember(memberId);
    };

    useEffect(() => {
        if (newApplicants?.length) {
            setApplicants(newApplicants);
        }
    }, [newApplicants]);

    useEffect(() => {
        if (memberId) {
            fetchApplicants();
        }
    }, [memberId]);

    const getApplicantDetails = useCallback(
        (jobId: string) => {
            return applicants.find((applicant) => applicant.job_id === jobId);
        },
        [applicants]
    );

    if (isLoading) {
        return <Loader />;
    }

    const jobs = getFilteredList(filter);

    return (
        <div className={css.jobs} data-analytics-page="jobs_tasks">
            <JobsHeader
                breadcrumbs={[{ name: 'Tasks', disabled: true }]}
                currentLink="Tasks"
                title="Tasks"
                onCreator={() => {
                    if (trialDashboard) discordModal.open();
                    else addModal.open();
                }}
                filter={filter}
                setFilter={setFilter}
            />
            <div className="container" data-analytics-parent="job_tasks_parent_container">
                <ul className={css.jobs_list}>
                    {jobs.map((job) => (
                        <li className={css.jobs_item} key={job.job_id}>
                            <JobsCard
                                type="task"
                                title={job.title}
                                projectName={job?.project_name}
                                daoName={job?.dao_name}
                                daoId={job.dao_id}
                                reviewer={job.poc_member}
                                payout={filterUniqueRanks(job.payout)?.map((payout) => {
                                    return {
                                        currency: payout.payout_currency,
                                        value: payout.payout_amount,
                                        icon:
                                            payout.payout_currency?.logo_uri ||
                                            '/img/tokens/ethereum-blue.png',
                                    };
                                })}
                                tags={job.skills}
                                onApply={() =>
                                    viewModal.open({ data: job, apply_tab: true, type: 'task' })
                                }
                                onView={() =>
                                    viewModal.open({
                                        data: job,
                                        apply_tab: false,
                                        type: 'task',
                                        status: getApplicantDetails(job.job_id)?.status,
                                        closed: job.status === 'closed',
                                    })
                                }
                                isSaved={favOpportunityList.some(
                                    (opportunity) => opportunity.job_id === job.job_id
                                )}
                                settings={{
                                    onArchive: () => archiveOpportunity(job.job_id),
                                    onSave: () => FavouriteOpportunity(job.job_id),
                                    onUnsave: () => DeleteOpportunity(job.job_id),
                                    onEdit: () => editModal.open({ data: job }),
                                    onRemove: () => removeOpportunity(job.job_id),
                                }}
                                closed={job.status === 'closed'}
                                applyStatus={getApplicantDetails(job.job_id)?.status}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <PopupBox
                active={addModal.active}
                onClose={addModal.close}
                effect="side"
                children={<JobsAddModal type="task" onClose={addModal.close} />}
            />
            <PopupBox
                active={editModal.active}
                onClose={editModal.close}
                effect="side"
                children={
                    <JobsAddModal
                        type="task"
                        jobData={editModal.payload?.data}
                        onClose={editModal.close}
                        isEdit
                    />
                }
            />
            {viewModal?.payload && (
                <PopupBox
                    active={viewModal.active}
                    onClose={viewModal.close}
                    effect="side"
                    children={
                        <JobsViewModal
                            type={viewModal.payload.type}
                            apply_tab={viewModal.payload.apply_tab}
                            data={viewModal.payload.data}
                            applicantStatus={viewModal.payload?.status}
                            onClose={viewModal.close}
                            closed={viewModal.payload?.closed}
                            callback={(id) => {
                                const newApplicant: Applicant = {
                                    applicant_id: '',
                                    job_id: id!,
                                    member_id: memberId,
                                    clan_id: '',
                                    answers: {},
                                    status: JobsEnums.ApplicantStatusType.APPLIED,
                                    application: '',
                                };
                                setApplicants([...applicants, newApplicant]);
                            }}
                        />
                    }
                />
            )}
            <PopupBox active={discordModal.active} onClose={discordModal.toggle}>
                <ConnectDiscordModal onClose={discordModal.close} />
            </PopupBox>
        </div>
    );
};

export default Jobs;
