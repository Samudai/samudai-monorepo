import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import usePopup from 'hooks/usePopup';
import css from 'pages/new-jobs/jobs.module.scss';
import {
    JobsAddModal,
    JobsCard,
    JobsEmpty,
    JobsHeader,
    useBounty,
    useJobs,
} from 'components/@pages/new-jobs';
import { JobsViewModal } from 'components/@pages/new-jobs/ui/jobs-view-modal';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Loader from 'components/Loader/Loader';
import { useJobsFilter } from 'components/@pages/new-jobs/libs/hooks/use-jobs-filter';

interface ArchiveProps {}

const Archive: React.FC<ArchiveProps> = () => {
    const { filter, setFilter } = useJobsFilter();

    const { jobType } = useParams<{ jobType: string }>();
    const navigate = useNavigate();
    const {
        archivedOpportunities,
        isLoading: taskLoading,
        unarchiveOpportunity,
        removeOpportunity,
    } = useJobs();
    const {
        archivedBounties,
        isLoading: bountyLoading,
        unarchiveBounty,
        removeBounty,
    } = useBounty();
    const editModal = usePopup<{
        type: 'task' | 'bounty';
        data: any;
    }>();
    const viewModal = usePopup<{
        data: any;
        apply_tab: boolean;
        type: 'task' | 'bounty';
    }>();

    let type = jobType?.toLowerCase();
    const title = type === 'tasks' ? 'Archived Tasks' : 'Archived Bounties';

    const getFilteredOpportunityList = useCallback(() => {
        let list = [...archivedOpportunities];
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
                item.skills.forEach((skill: string) => {
                    if (filter.tags.includes(skill)) check = true;
                });
                return check;
            });
        }
        return list;
    }, [archivedOpportunities, filter]);

    const getFilteredBountyList = useCallback(() => {
        let list = [...archivedBounties];
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
                item.skills.forEach((skill: string) => {
                    if (filter.tags.includes(skill)) check = true;
                });
                return check;
            });
        }
        return list;
    }, [archivedBounties, filter]);

    const jobTitle = useMemo(() => {
        if (jobType === 'tasks') return 'Tasks';
        if (jobType === 'bounty') return 'Bounty';
        return '';
    }, [jobType]);

    useEffect(() => {
        if (type !== 'bounty' && type !== 'tasks') {
            return navigate('/jobs/tasks');
        }
    }, [jobType]);

    if ((type === 'tasks' && taskLoading) || (type === 'bounty' && bountyLoading)) {
        return <Loader />;
    }

    const tasksList = getFilteredOpportunityList();
    const bountyList = getFilteredBountyList();

    return (
        <div className={css.jobs} data-analytics-page="jobs_archive">
            <JobsHeader
                breadcrumbs={[
                    { name: jobTitle, href: `/jobs/${jobType}` },
                    { name: title, disabled: true },
                ]}
                currentLink={title}
                title={title}
                controls={{
                    filter: true,
                }}
                filter={filter}
                setFilter={setFilter}
            />
            <div className="container" data-analytics-parent="archived_tasks">
                {type === 'tasks' && (
                    <>
                        {tasksList.length > 0 ? (
                            <ul className={css.jobs_list}>
                                {tasksList.map((job) => (
                                    <li className={css.jobs_item} key={job.job_id}>
                                        <JobsCard
                                            title={job.title}
                                            projectName={job?.project_name}
                                            daoName={job?.dao_name}
                                            daoId={job.dao_id}
                                            reviewer={job.poc_member}
                                            payout={job.payout?.map((payout) => {
                                                return {
                                                    currency: payout.payout_currency,
                                                    value: payout.payout_amount,
                                                    icon:
                                                        payout.payout_currency.logo_uri ||
                                                        '/img/tokens/ethereum-blue.png',
                                                };
                                            })}
                                            onView={() =>
                                                viewModal.open({
                                                    data: job,
                                                    apply_tab: false,
                                                    type: 'task',
                                                })
                                            }
                                            tags={job.skills}
                                            settings={{
                                                onUnarchive: () => unarchiveOpportunity(job.job_id),
                                                onEdit: () =>
                                                    editModal.open({ data: job, type: 'task' }),
                                                onRemove: () => removeOpportunity(job.job_id),
                                            }}
                                            data-analytics-click={job.dao_id}
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <JobsEmpty title="You have no archived tasks yet!" />
                        )}
                    </>
                )}

                {type === 'bounty' && (
                    <>
                        {bountyList.length > 0 ? (
                            <ul className={css.jobs_list}>
                                {bountyList.map((bounty) => (
                                    <li className={css.content_item} key={bounty.bounty_id}>
                                        <JobsCard
                                            title={bounty.title}
                                            projectName={bounty?.project_name}
                                            daoName={bounty?.dao_name}
                                            daoId={bounty.dao_id}
                                            reviewer={bounty.poc_member}
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
                                            onView={() =>
                                                viewModal.open({
                                                    data: bounty,
                                                    apply_tab: false,
                                                    type: 'bounty',
                                                })
                                            }
                                            tags={bounty.skills}
                                            settings={{
                                                onUnarchive: () =>
                                                    unarchiveBounty(bounty.bounty_id),
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
                            <JobsEmpty title="You have no archived bounties yet!" />
                        )}
                    </>
                )}
            </div>
            <PopupBox
                active={editModal.active}
                onClose={editModal.close}
                effect="side"
                children={
                    <JobsAddModal
                        type={editModal.payload?.type!}
                        jobData={editModal.payload?.data}
                        onClose={editModal.close}
                    />
                }
            />
            <PopupBox
                active={viewModal.active}
                onClose={viewModal.close}
                effect="side"
                children={
                    <JobsViewModal
                        type={viewModal.payload?.type!}
                        apply_tab={viewModal.payload?.apply_tab!}
                        data={viewModal.payload?.data!}
                        onClose={viewModal.close}
                    />
                }
            />
        </div>
    );
};

export default Archive;
