import React, { useEffect, useState } from 'react';
import {
    BountyResponse,
    JobPayout,
    OpportunityResponse,
    Task,
    TaskResponse,
} from '@samudai_xyz/gateway-consumer-types';
import { Provider } from '@samudai_xyz/gateway-consumer-types/dist/types';
import { v4 as uuidv4 } from 'uuid';
import { useLazyGetTaskDetailsQuery } from 'store/services/projects/tasks';
import Popup from 'components/@popups/components/Popup/Popup';
import CloseButton from 'ui/@buttons/Close/Close';
import { JobCard } from './components';
import css from './projects-post-job.module.scss';
import { IBountyPayout, IPayout, PayoutCurrency } from 'components/payout/types';
import { getPositions } from 'components/payout/lib';

interface ProjectsPostJobProps {
    data: Task;
    onClose: () => void;
    opportunity?: OpportunityResponse;
    bounty?: BountyResponse;
}

export interface ITaskPayout {
    providerId?: string;
    provider: Provider;
    currency: PayoutCurrency;
    amount: string | number;
}

export interface ITaskJob {
    id: string;
    type: 'Task' | 'Bounties';
    skills: string[];
    applicantCount?: number;
    payouts: IPayout[];
    winnerCount?: number;
    bountyPayouts: IBountyPayout[];
}

const getDefaultJob = (): ITaskJob => ({
    id: uuidv4(),
    type: 'Task',
    skills: [],
    payouts: [],
    bountyPayouts: [],
});

export const filterUniqueRanks = (arr?: JobPayout[]) => {
    if (!arr) return undefined;
    const uniqueRanks = new Set();
    const result = [];

    for (const obj of arr) {
        if (!uniqueRanks.has(obj.rank)) {
            uniqueRanks.add(obj.rank);
            result.push(obj);
        }
    }

    return result;
};

export const ProjectsPostJob: React.FC<ProjectsPostJobProps> = ({
    data,
    onClose,
    opportunity,
    bounty,
}) => {
    const [jobs, setJobs] = useState<ITaskJob[]>([getDefaultJob()]);
    const [taskData, setTaskData] = useState<TaskResponse>(data!);
    const [getDetails] = useLazyGetTaskDetailsQuery();
    const [isEdit, setIsEdit] = useState(true);
    const positions = getPositions();

    const fetchTask = async () => {
        if (data?.task_id) {
            localStorage.setItem('_taskid', data.task_id);
            localStorage.setItem('_projectid', data.project_id);

            getDetails(data.task_id)
                .unwrap()
                .then((res) => {
                    setTaskData({
                        ...taskData,
                        assignees: res?.data?.assignees || [],
                        payout: res?.data?.payout || [],
                        subtasks: res?.data?.subtasks || [],
                    });
                })
                .finally(() => {
                    localStorage.removeItem('_taskid');
                    localStorage.removeItem('_projectid');
                });
        }
    };

    const onChangeJob = (job: ITaskJob) => {
        setJobs(jobs.map((oldJob) => (oldJob.id === job.id ? job : oldJob)));
    };

    useEffect(() => {
        fetchTask();
    }, []);

    useEffect(() => {
        if (opportunity) {
            setJobs([
                {
                    id: opportunity.job_id,
                    type: 'Task',
                    skills: opportunity.skills,
                    applicantCount: opportunity.req_people_count,
                    payouts:
                        filterUniqueRanks(opportunity?.payout)?.map((item) => ({
                            amount: String(item.payout_amount * opportunity.req_people_count),
                            currency: item.payout_currency,
                            provider: item.provider_id,
                            id: item.payout_id,
                        })) || [],
                    bountyPayouts: [],
                },
            ]);
            setIsEdit(false);
        } else if (bounty) {
            setJobs([
                {
                    id: bounty.bounty_id,
                    type: 'Bounties',
                    skills: bounty?.skills || [],
                    payouts: [],
                    winnerCount: bounty.winner_count,
                    bountyPayouts:
                        bounty?.payout?.map((item, index) => ({
                            id: item.payout_id,
                            position: index + 1,
                            transactions: [
                                {
                                    id: item.payout_id,
                                    provider: item.provider_id,
                                    amount: item.payout_amount,
                                    currency: item.payout_currency,
                                },
                            ],
                        })) || [],
                },
            ]);
            setIsEdit(false);
        }
    }, [opportunity, bounty]);

    return (
        <Popup className={css.creator} dataParentId="post_as_job_sidebar">
            <div className={css.creator_head}>
                <h2 className={css.creator_title}>Post a Job</h2>
                <CloseButton className={css.creator_closeBtn} onClick={onClose} />
            </div>
            <JobCard taskData={taskData} data={jobs[0]} onChange={onChangeJob} edit={isEdit} />
        </Popup>
    );
};
