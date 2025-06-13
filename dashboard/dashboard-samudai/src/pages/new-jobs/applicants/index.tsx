import React, { useCallback, useEffect, useState } from 'react';
import { Applicant, JobsEnums, Submission } from '@samudai_xyz/gateway-consumer-types';
import usePopup from 'hooks/usePopup';
import {
    JobsAddModal,
    JobsCard,
    JobsEmpty,
    JobsHeader,
    JobsStat,
    JobsTabs,
    useApplicants,
    useBounty,
    useJobs,
    useSubmissions,
} from 'components/@pages/new-jobs';
import { JobsViewModal } from 'components/@pages/new-jobs/ui/jobs-view-modal';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import SidebarIcons from 'ui/SVG/sidebar';
import { getMemberId } from 'utils/utils';
import css from './applicants.module.scss';
import Button from 'ui/@buttons/Button/Button';
import { useJobsFilter } from 'components/@pages/new-jobs/libs/hooks/use-jobs-filter';
import { useNavigate } from 'react-router-dom';

const Applicants: React.FC = () => {
    const [activeTab, setActiveTab] = useState('tasks');
    const [applicants, setApplicants] = useState<Applicant[]>([]);
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    const { filter, setFilter } = useJobsFilter();
    const navigate = useNavigate();
    const memberId = getMemberId();
    const { archiveOpportunity, removeOpportunity } = useJobs(true);
    const { archiveBounty, removeBounty } = useBounty(true);
    const {
        opportunities: jobsList,
        isLoading,
        getFilteredList: getFilteredOpportunityList,
        getApplicantsForMember,
    } = useApplicants();
    const {
        bountyList,
        getFilteredList: getFilteredBountyList,
        getSubmissionsForMember,
    } = useSubmissions();
    const viewModal = usePopup<{
        data: any;
        apply_tab: boolean;
        type: 'task' | 'bounty';
        status?: JobsEnums.ApplicantStatusType;
    }>();
    const editModal = usePopup<{
        type: 'task' | 'bounty';
        data: any;
    }>();

    const fetchApplicants = async () => {
        await getApplicantsForMember(memberId).then((res) => setApplicants(res));
    };

    const fetchSubmissions = async () => {
        await getSubmissionsForMember(memberId).then((res) => setSubmissions(res));
    };

    useEffect(() => {
        if (memberId) {
            fetchApplicants();
            fetchSubmissions();
        }
    }, [memberId]);

    const getApplicantDetails = useCallback(
        (jobId: string) => {
            return applicants.find((applicant) => applicant.job_id === jobId);
        },
        [applicants]
    );

    const getSubmissionDetails = useCallback(
        (bountyId: string) => {
            return submissions.find((submission) => submission.bounty_id === bountyId);
        },
        [submissions]
    );

    if (isLoading) {
        return <Loader />;
    }

    const taskListRender = getFilteredOpportunityList(filter);
    const bountyListRender = getFilteredBountyList(filter);

    return (
        <div className={css.applicants} data-analytics-page="jobs_applicants">
            <JobsHeader
                breadcrumbs={[{ name: 'Applicants', disabled: true }]}
                title="Applicants"
                currentLink="Applicants"
                controls={{
                    filter: true,
                }}
                filter={filter}
                setFilter={setFilter}
            />
            <div className="container">
                <div className={css.stats}>
                    <div className={css.stats_item}>
                        <JobsStat
                            icon={<SidebarIcons.JobsBoard className={css.stats_icon_yellow} />}
                            value={jobsList.length + bountyList.length}
                            title="Total Jobs"
                        />
                    </div>
                    {/* <div className={css.stats_item}>
                        <JobsStat
                            icon={<EyeIcon className={css.stats_icon_orange} />}
                            value="NaN"
                            title="Total Views"
                        />
                    </div>
                    <div className={css.stats_item}>
                        <JobsStat icon={<FilterIcon />} value="NaN" title="CTR %" />
                    </div> */}
                </div>

                <div className={css.content}>
                    <JobsTabs
                        activeTab={activeTab}
                        tabs={[
                            {
                                name: 'tasks',
                                count: taskListRender.length,
                            },
                            {
                                name: 'bounty',
                                count: bountyListRender.length,
                            },
                        ]}
                        onChange={(tab) => setActiveTab(tab.name)}
                    />

                    {activeTab === 'tasks' ? (
                        <>
                            {taskListRender.length > 0 ? (
                                <ul className={css.content_list}>
                                    {taskListRender.map((job) => (
                                        <li className={css.content_item} key={job.job_id}>
                                            <JobsCard
                                                title={job.title}
                                                projectName={job?.project_name}
                                                daoName={job?.dao_name}
                                                daoId={job.dao_id}
                                                reviewer={job.poc_member}
                                                applicants={{
                                                    count: job.total_applicant_count,
                                                    href: `/jobs/applicants/${
                                                        job.job_id
                                                    }/${activeTab.toLowerCase()}`,
                                                }}
                                                payout={job.payout?.map((payout) => {
                                                    return {
                                                        currency: payout.payout_currency,
                                                        value: payout.payout_amount,
                                                        icon:
                                                            payout.payout_currency.logo_uri ||
                                                            '/img/tokens/ethereum-blue.png',
                                                    };
                                                })}
                                                tags={job.skills}
                                                onView={() =>
                                                    viewModal.open({
                                                        data: job,
                                                        apply_tab: false,
                                                        type: 'task',
                                                        status: getApplicantDetails(job.job_id)
                                                            ?.status,
                                                    })
                                                }
                                                settings={{
                                                    onArchive: () => archiveOpportunity(job.job_id),
                                                    onEdit: () =>
                                                        editModal.open({
                                                            data: job,
                                                            type: 'task',
                                                        }),
                                                    onRemove: () => removeOpportunity(job.job_id),
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={css.empty}>
                                    <JobsEmpty title="You have no tasks created! Create a Task." />
                                    <Button className={css.empty_btn} color="orange-outlined">
                                        <span>Post a Job</span>
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            {bountyListRender.length > 0 ? (
                                <ul className={css.content_list}>
                                    {bountyListRender.map((bounty) => (
                                        <li className={css.content_item} key={bounty.bounty_id}>
                                            <JobsCard
                                                title={bounty.title}
                                                projectName={bounty?.project_name}
                                                daoName={bounty?.dao_name}
                                                daoId={bounty.dao_id}
                                                reviewer={bounty.poc_member}
                                                applicants={{
                                                    count: bounty.total_applicant_count,
                                                    href: `/jobs/applicants/${
                                                        bounty.bounty_id
                                                    }/${activeTab.toLowerCase()}`,
                                                }}
                                                winners={bounty.winner_count}
                                                payout={bounty.payout?.map((payout) => {
                                                    return {
                                                        currency: payout.payout_currency,
                                                        value: payout.payout_amount,
                                                        icon:
                                                            payout.payout_currency.logo_uri ||
                                                            '/img/tokens/ethereum-blue.png',
                                                    };
                                                })}
                                                tags={bounty.skills}
                                                onView={() =>
                                                    viewModal.open({
                                                        data: bounty,
                                                        apply_tab: false,
                                                        type: 'bounty',
                                                        status: getSubmissionDetails(
                                                            bounty.bounty_id
                                                        )?.status,
                                                    })
                                                }
                                                settings={{
                                                    onArchive: () =>
                                                        archiveBounty(bounty.bounty_id),
                                                    onEdit: () =>
                                                        editModal.open({
                                                            data: bounty,
                                                            type: 'bounty',
                                                        }),
                                                    onRemove: () => removeBounty(bounty.bounty_id),
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={css.empty}>
                                    <JobsEmpty title="You have no tasks created! Create a Task." />
                                    <Button className={css.empty_btn} color="orange-outlined">
                                        <span>Post a Job</span>
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {editModal.payload && (
                <PopupBox
                    active={editModal.active}
                    onClose={editModal.close}
                    effect="side"
                    children={
                        <JobsAddModal
                            type={editModal.payload.type}
                            jobData={editModal.payload?.data}
                            onClose={editModal.close}
                        />
                    }
                />
            )}
            {viewModal.payload && (
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
                            callback={() => {
                                if (viewModal.payload?.type === 'task') fetchApplicants();
                                else fetchSubmissions();
                            }}
                        />
                    }
                />
            )}
        </div>
    );
};

export default Applicants;
