import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import {
    useLazyGetOpenBountiesQuery,
    useLazyGetPublicOpportunitiesQuery,
} from 'store/services/jobs/totalJobs';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import JobControls from 'components/@pages/jobs/JobControls';
import JobFilters from 'components/@pages/jobs/JobFilters';
import JobHead from 'components/@pages/jobs/JobHead';
import JobItem from 'components/@pages/jobs/JobItem';
import JobCreate from 'components/@pages/jobs/popups/JobCreate';
import JobFilter from 'components/@pages/jobs/popups/JobFilter';
import JobInfo from 'components/@pages/jobs/popups/JobInfo';
import JobSaved from 'components/@pages/jobs/popups/JobSaved';
import JobApply from 'components/@pages/jobs/popups/job-apply';
import { getJobDefaultFilter } from 'components/@pages/jobs/utils/defaultFilter';
import { getRangeBounty } from 'components/@pages/jobs/utils/getBountyRange';
import { getFilterList } from 'components/@pages/jobs/utils/getFilterList';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Filter from 'components/@popups/components/elements/Filter';
import Breadcrumbs from 'components/breadcrumbs';
import Button from 'ui/@buttons/Button/Button';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import { JobFilter as FilterType, JobType, OpportunityResponse } from 'utils/types/Jobs';
import { toggleArrayItem } from 'utils/use';
import { getMemberId } from 'utils/utils';
import styles from 'styles/pages/jobs.module.scss';

const getJobType = (role?: string) => {
    switch (role?.toLowerCase()) {
        case 'project':
            return JobType.PROJECT;
        case 'task':
            return JobType.TASK;
        case 'bounty':
            return JobType.BOUNTY;
        default:
            return '';
    }
};

const Jobs: React.FC = () => {
    const { role } = useParams<{ role?: string }>();
    const jobType = useMemo(() => getJobType(role), [role]);
    // const [currentTab, setCurrentTab] = useState<JobType>(JobType.PROJECT);
    const [list, setList] = useState<OpportunityResponse[]>([]);
    const [search, setSearch] = useState('');
    const [data, setData] = useState({
        filter: getJobDefaultFilter(),
        bounty: { min: 1, max: 2 },
    });
    const [savedJobs, setSavedJobs] = useState<OpportunityResponse[]>([]);
    const [jobsList, setJobsList] = useState<OpportunityResponse[]>([] as OpportunityResponse[]);
    const [bountyList, setBountyList] = useState<OpportunityResponse[]>(
        [] as OpportunityResponse[]
    );
    const navigate = useNavigate();

    const member_id: string = getMemberId();
    const daoid: string = useTypedSelector(selectActiveDao);
    const [getPublicJobs] = useLazyGetPublicOpportunitiesQuery();
    const [getOpenBounties] = useLazyGetOpenBountiesQuery();
    // Popups
    const filterPopup = usePopup();
    const createPopup = usePopup();
    const savedPopup = usePopup();
    const applyPopup = usePopup<OpportunityResponse | null>();
    const infoPopup = usePopup<OpportunityResponse | null>();

    useEffect(() => {
        const fetchJobs = async () => {
            const res = await getPublicJobs(undefined, true).unwrap();
            const res2 = await getOpenBounties(undefined, true).unwrap();
            // setJobsList(res.data.opportunities || []);
            const bounties = res2?.data?.bounty?.map((b) => {
                return { ...b, type: JobType.BOUNTY };
            });
            // setBountyList(bounties);
        };
        fetchJobs();
    }, [daoid]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleSetFilter = (filter: FilterType) => {
        setData({ ...data, filter });
    };

    const handleClearFilter = () => {
        setData({ ...data, filter: { ...getJobDefaultFilter(), bounty: data.bounty } });
        filterPopup.close();
    };

    const handleSaveJob = (job: OpportunityResponse) => {
        setSavedJobs(toggleArrayItem(savedJobs, job));
    };

    useEffect(() => {
        if (jobType === '') {
            navigate('/jobs/projects');
            return;
        }
        let list: OpportunityResponse[] = [];
        let bounty = {
            min: 1,
            max: 100,
        };
        if (jobType !== JobType.BOUNTY) {
            list = jobsList?.filter((j) => j.type.includes(jobType)) || [];
            bounty = getRangeBounty(list);
        } else if (jobType === JobType.BOUNTY) {
            list = bountyList?.filter((j) => j.type.includes(jobType)) || [];
            if (list.length) bounty = getRangeBounty(list);
        }

        setList(list || []);
        setSearch('');
        setData({
            filter: { ...getJobDefaultFilter(), bounty },
            bounty,
        });
    }, [jobType, jobsList]);

    return (
        <div className={styles.root} data-analytics-page="jobs">
            <div
                className={clsx('container', styles.container)}
                data-analytics-parent="jobs_parent_container"
            >
                <Breadcrumbs
                    className={styles.root_breadcrumbs}
                    links={[
                        { name: 'Jobs' },
                        { name: jobType[0].toUpperCase() + jobType.slice(1) },
                    ]}
                />
                <div className={styles.head}>
                    <h1 className={styles.title}>Jobs</h1>
                    <div className={styles.headRight}>
                        <Button
                            color="green"
                            className={styles.headViewBtn}
                            onClick={() => navigate('/applicants')}
                            data-analytics-click="view_job_applicants_btn"
                        >
                            <span>View Applicants</span>
                        </Button>
                        <Button
                            color="orange"
                            className={styles.headPostBtn}
                            onClick={createPopup.open}
                            data-analytics-click="post_new_job_btn"
                        >
                            <PlusIcon />
                            <span>Post New</span>
                        </Button>
                    </div>
                </div>
                <JobHead createPost={createPopup.open} />
                <JobControls
                    search={search}
                    onSearch={handleSearch}
                    onFilter={filterPopup.open}
                    onSaved={savedPopup.open}
                    savedActive={savedJobs.length > 0}
                />

                <button
                    className={styles.controlsBtn}
                    data-class="filter"
                    onClick={savedPopup.open}
                    data-analytics-click="check_saved_jobs_btn"
                >
                    <ArchiveIcon
                        className={savedJobs.length > 0 ? styles.controlsBtnSvgFill : null}
                    />
                    <span>Saved Jobs</span>
                </button>

                <JobFilters bounty={data.bounty} filter={data.filter} setFilter={handleSetFilter} />

                {/* List */}
                <ul className={styles.jobs}>
                    <JobItem placeholder />
                    {list.length > 0 &&
                        getFilterList(list, data.filter).map((item) => (
                            <JobItem
                                title={item.title}
                                tags={item.tags}
                                payoutCurrency={item.payout_currency}
                                payoutAmount={item.payout_amount}
                                openTo={item.open_to}
                                minPeople={item.req_people_count}
                                department={item.department || ''}
                                saved={!!savedJobs.find((j) => j.job_id === item.job_id)}
                                onSave={() => handleSaveJob(item)}
                                onDetail={() => infoPopup.open(item)}
                                key={item.job_id}
                            />
                        ))}
                </ul>
            </div>
            {/* Popups */}
            <Filter active={filterPopup.active} onClose={filterPopup.close}>
                <JobFilter
                    data={data}
                    setData={handleSetFilter}
                    active={filterPopup.active}
                    clearFilter={handleClearFilter}
                />
            </Filter>
            <PopupBox active={savedPopup.active} onClose={savedPopup.close} effect="side">
                <JobSaved jobs={savedJobs} onDetail={infoPopup.open} onClose={savedPopup.close} />
            </PopupBox>
            <PopupBox active={infoPopup.active} onClose={infoPopup.close} effect="side">
                {jobType && (
                    <JobInfo data={infoPopup.payload!} type={jobType} onApply={applyPopup.open} />
                )}
            </PopupBox>
            <PopupBox active={createPopup.active} onClose={createPopup.close} effect="side">
                <JobCreate onClose={createPopup.close} />
            </PopupBox>
            <PopupBox active={applyPopup.active} onClose={applyPopup.close} effect="side">
                <JobApply
                    data={applyPopup.payload!}
                    onSubmit={applyPopup.close}
                    onSave={handleSaveJob.bind(null, applyPopup.payload!)}
                    isSaved={!!savedJobs.find((j) => j.job_id === applyPopup.payload?.job_id)}
                />
            </PopupBox>
        </div>
    );
};

export default Jobs;
