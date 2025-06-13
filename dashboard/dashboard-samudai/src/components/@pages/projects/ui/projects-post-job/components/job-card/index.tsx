import React, { useEffect, useMemo, useState } from 'react';

import { ITaskJob } from '../..';
import { ProjectsAccordeon } from '../../../projects-accordeon';
import clsx from 'clsx';
import { ArrowDownIcon } from 'components/editor/ui/icons';
import MultiSelect from 'components/multi-select';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import { CloneObject } from 'utils/clone-object';
import css from './job-card.module.scss';
import { TaskResponse, NotificationsEnums, AccessEnums } from '@samudai_xyz/gateway-consumer-types';
import { useParams } from 'react-router-dom';
import { JobsEnums } from '@samudai_xyz/gateway-consumer-types';
import { getMemberId } from 'utils/utils';
import { BountyRequest, OpportunityRequest } from 'store/services/jobs/model';
import {
    useCreateOpportunityMutation,
    useCreateBountyMutation,
    useGetSkillListForJobQuery,
} from 'store/services/jobs/totalJobs';
import { toast } from 'utils/toast';
import sendNotification from 'utils/notification/sendNotification';
import SetupWallet from 'components/@pages/payments/SetupWallet';
import { useTypedSelector } from 'hooks/useStore';
import { selectAccess } from 'store/features/common/slice';
import { createPayoutDef, getPositions } from 'components/payout/lib';
import { IPayout as ITaskPayout } from 'components/payout/types';
import { PayoutBounty, PayoutMultiple } from 'components/payout';
import { PayoutAdd } from 'components/payout/ui/payout-add';
import mixpanel from 'utils/mixpanel/mixpanelInit';

interface JobCardProps {
    data: ITaskJob;
    taskData: TaskResponse;
    onChange: (job: ITaskJob) => void;
    edit?: boolean;
}

export const indexes = [
    'First',
    'Second',
    'Third',
    'Fourth',
    'Fifth',
    'Sixth',
    'Seventh',
    'Eighth',
    'Ninth',
    'Tenth',
];

export const JobCard: React.FC<JobCardProps> = ({ taskData, data, onChange, edit = true }) => {
    const [localData, setLocalData] = useState<ITaskJob>(CloneObject(data));
    const [countContributors, setCountContributors] = useState<number>(1);
    const [countWinners, setCountWinners] = useState<number>(1);
    const [payoutIndex, setPayoutIndex] = useState(0);
    const [isEdit, setIdEdit] = useState(edit);
    const positions = getPositions();

    const { daoid, projectId } = useParams();
    const [createOpportunity] = useCreateOpportunityMutation();
    const [createBounty] = useCreateBountyMutation();
    const { data: skillList } = useGetSkillListForJobQuery();
    const member_id = getMemberId();
    const daoAccess = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);

    const onChangeWinners = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const value = +ev.target.value.replaceAll(/\D+/g, '');
        if (value > 10) {
            setCountWinners(10);
        } else {
            setCountWinners(value);
        }
    };

    const onChangeContributors = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const value = +ev.target.value.replaceAll(/\D+/g, '');
        if (value > 5) {
            setCountContributors(5);
        } else {
            setCountContributors(value);
        }
    };

    const onChangeType = (type: 'Task' | 'Bounties') => {
        setLocalData({
            ...localData,
            type,
        });
        setPayoutIndex(0);
    };

    const onChangePayout = (payout: ITaskPayout) => {
        setLocalData({
            ...localData,
            payouts: localData.payouts.map((item) => (item.id === payout.id ? payout : item)),
        });
    };

    const onRemovePayout = (payout: ITaskPayout) => {
        setLocalData({
            ...localData,
            payouts: localData.payouts.filter((item) => item.id !== payout.id),
        });
    };

    const onAddPayout = () => {
        setLocalData({
            ...localData,
            payouts: [...localData.payouts, createPayoutDef()],
        });
    };

    const checkPayoutList = (payouts: ITaskPayout[]) => {
        let check = true;
        payouts.forEach((payout) => {
            if (!payout.currency || !payout.amount) {
                check = false;
            } else if (!payout.provider) {
                check = false;
            }
        });
        return check;
    };

    const checkPayoutAmount = (payouts: ITaskPayout[]) => {
        let check = true;
        payouts.forEach((payout) => {
            if (isNaN(+payout.amount)) {
                check = false;
            } else if (+payout.amount < 0) {
                check = false;
            }
        });
        return check;
    };

    const onSave = () => {
        onChange(localData);
        if (localData.type === 'Task') {
            if (!localData.payouts.length) {
                return toast(
                    'Attention',
                    5000,
                    'Number of contributors should be greater than equal to 1',
                    ''
                )();
            }
            if (!checkPayoutList(localData.payouts)) {
                return toast('Attention', 5000, 'Please fill all the payout details', '')();
            }
            if (!checkPayoutAmount(localData.payouts)) {
                return toast('Attention', 5000, 'Please enter valid payout amount', '')();
            }
            const payload: OpportunityRequest = {
                dao_id: daoid!,
                project_id: projectId!,
                task_id: taskData.task_id!,
                type: JobsEnums.JobType.TASK,
                title: taskData.title,
                description: '',
                description_raw: '',
                created_by: getMemberId(),
                visibility: JobsEnums.Visibility.PUBLIC,
                status: JobsEnums.JobStatus.OPEN,
                req_people_count: countContributors || 0,
                captain: false,
                skills: localData.skills,
                tags: taskData.tags!,
                experience: 0,
                open_to: Object.values(JobsEnums.OpportunityOpenTo),
                job_format: JobsEnums.JobFormat.FREELANCE,
                payout: localData.payouts.map((payout) => {
                    return {
                        link_type: 'task',
                        link_id: taskData.task_id!,
                        provider_id: payout.provider,
                        payout_amount: +payout.amount,
                        payout_currency: payout.currency,
                        completed: false,
                        status: JobsEnums.JobPayoutStatus.UNASSIGNED,
                    };
                }),
            };

            try {
                createOpportunity({ opportunity: payload })
                    .unwrap()
                    .then((res) => {
                        setIdEdit(false);
                        toast('Success', 3000, 'Job created successfully', '')();
                        if (res?.data?.job_id && taskData?.task_id) {
                            mixpanel.track('task_posted_as_job', {
                                project_id: projectId,
                                task_id: taskData.task_id,
                                job_id: res.data.job_id,
                                member_id: getMemberId(),
                                timestamp: new Date().toUTCString(),
                                dao_id: daoid!,
                            });
                            sendNotification({
                                to: [daoid!],
                                for: NotificationsEnums.NotificationFor.ADMIN_MEMBER,
                                from: member_id,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: taskData.task_id,
                                    redirect_link: `/${daoid}/projects/${projectId}/board`,
                                },
                                type: NotificationsEnums.SocketEventsToServiceProject
                                    .TASK_POSTED_AS_JOB_OR_BOUNTY,
                            });
                            sendNotification({
                                to: [],
                                for: NotificationsEnums.NotificationFor.MEMBER,
                                from: member_id,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: res.data.job_id,
                                    redirect_link: `/jobs/tasks`,
                                },
                                type: NotificationsEnums.SocketEventsToServicePayment
                                    .JOB_POSTED_NOTIFICATION,
                            });
                        }
                    });
            } catch (err: any) {
                toast('Failure', 3000, 'Failed to create job', '')();
            }
        } else if (localData.type === 'Bounties') {
            if (!localData.bountyPayouts.length) {
                return toast(
                    'Attention',
                    5000,
                    'Number of winners should be greater than equal to 1',
                    ''
                )();
            }
            if (!checkPayoutList(localData.bountyPayouts.map((item) => item.transactions[0]))) {
                return toast('Attention', 5000, 'Please fill payout for all the positions', '')();
            }
            if (!checkPayoutAmount(localData.bountyPayouts.map((item) => item.transactions[0]))) {
                return toast('Attention', 5000, 'Please enter valid payout amount', '')();
            }
            const payload: BountyRequest = {
                dao_id: daoid!,
                project_id: projectId!,
                task_id: taskData.task_id!,
                title: taskData.title,
                winner_count: countWinners || 0,
                created_by: getMemberId(),
                visibility: JobsEnums.Visibility.PUBLIC,
                status: JobsEnums.JobStatus.OPEN,
                tags: taskData.tags!,
                skills: localData.skills,
                payout: localData.bountyPayouts.map((payout, index) => {
                    return {
                        link_type: 'task',
                        link_id: taskData.task_id!,
                        provider_id: payout.transactions[0].provider,
                        payout_amount: +payout.transactions[0].amount,
                        payout_currency: payout.transactions[0].currency,
                        completed: false,
                        status: JobsEnums.JobPayoutStatus.UNASSIGNED,
                    };
                }),
            };

            try {
                createBounty({ bounty: payload })
                    .unwrap()
                    .then((res) => {
                        setIdEdit(false);
                        toast('Success', 3000, 'Job created successfully', '')();
                        if (res?.data?.bounty_id && taskData.task_id) {
                            sendNotification({
                                to: [daoid!],
                                for: NotificationsEnums.NotificationFor.ADMIN_MEMBER,
                                from: member_id,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: taskData.task_id,
                                    redirect_link: `/${daoid}/projects/${projectId}/board`,
                                },
                                type: NotificationsEnums.SocketEventsToServiceProject
                                    .TASK_POSTED_AS_JOB_OR_BOUNTY,
                            });
                            sendNotification({
                                to: [],
                                for: NotificationsEnums.NotificationFor.MEMBER,
                                from: member_id,
                                by: NotificationsEnums.NotificationCreatedby.MEMBER,
                                metadata: {
                                    id: res.data.bounty_id,
                                    redirect_link: `/jobs/bounty`,
                                },
                                type: NotificationsEnums.SocketEventsToServicePayment
                                    .BOUNTY_POSTED_NOTIFICATION,
                            });
                        }
                    });
            } catch (err: any) {
                toast('Failure', 3000, 'Failed to create job', '')();
            }
        }
    };

    const totalPayout = useMemo(() => {
        const total: Record<string, number> = {};

        for (const { currency, amount } of localData.payouts) {
            if (!+amount) continue;
            total[currency.name] = total[currency.name] ? total[currency.name] + +amount : +amount;
        }
        return Object.entries(total);
    }, [localData.payouts]);

    useEffect(() => {
        setIdEdit(edit);
    }, [edit]);

    useEffect(() => {
        setLocalData(CloneObject(data));
        if (data.applicantCount) setCountContributors(data.applicantCount);
        if (data.winnerCount) setCountWinners(data.winnerCount);
    }, [data]);

    useEffect(() => {
        if (data.type === 'Task' && !data.payouts?.length) {
            setLocalData((localData) => ({ ...localData, payouts: [createPayoutDef()] }));
        }
    }, [data]);

    const isCompleted =
        localData.type === 'Bounties'
            ? localData.bountyPayouts.every((p) => p.transactions.every((t) => !!t.completed))
            : localData.payouts.every((p) => !!p.completed);

    console.log(localData);

    return (
        <>
            <div className={css.creator_content}>
                <ul className={css.creator_content_list}>
                    <ProjectsAccordeon
                        className={css.item}
                        classNameActive={css.itemActive}
                        // onClose={() => setLocalData({...data})}
                        button={(active) => (
                            <div className={css.item_button}>
                                <Checkbox className={css.item_checkbox} active={isCompleted} mark />
                                <h4 className={css.item_title}>{taskData.title}</h4>
                                {/* <p className={css.item_postJobTitle}>Post as Job</p> */}
                                {!active && edit && !isCompleted && (
                                    <p className={css.details}>
                                        {/* <Sprite url="/img/sprite.svg#plus" /> */}
                                        <span>Post as Job</span>
                                    </p>
                                )}
                                {!edit && (
                                    <p className={css.details_1}>
                                        <span>Job Posted</span>
                                    </p>
                                )}
                                {isCompleted && (
                                    <p className={css.setted}>
                                        {localData.type === 'Bounties'
                                            ? '1'
                                            : localData.payouts.length}{' '}
                                        Payout(s) Set
                                    </p>
                                )}
                                <ArrowDownIcon className={css.item_downIcon} />
                            </div>
                        )}
                        content={
                            <div
                                className={clsx(
                                    css.item_content,
                                    localData.type === 'Task' && css.item_contentTask
                                )}
                            >
                                <div className={css.item_type}>
                                    <div
                                        className={css.item_type_btn}
                                        onClick={() => isEdit && onChangeType('Task')}
                                        data-analytics-click="job_type_radio_task"
                                    >
                                        <Radio
                                            className={css.item_type_radio}
                                            checked={localData.type === 'Task'}
                                        />
                                        <span>Task</span>
                                    </div>
                                    <div
                                        className={css.item_type_btn}
                                        onClick={() => isEdit && onChangeType('Bounties')}
                                        data-analytics-click="job_type_radio_bounty"
                                    >
                                        <Radio
                                            className={css.item_type_radio}
                                            checked={localData.type === 'Bounties'}
                                        />
                                        <span>Bounties</span>
                                    </div>
                                </div>
                                <MultiSelect
                                    data={localData.skills.map((item) => ({
                                        label: item,
                                        value: item,
                                    }))}
                                    onChange={(skills) =>
                                        setLocalData({
                                            ...localData,
                                            skills: skills.map((i) => i.label),
                                        })
                                    }
                                    className={css.item_skills}
                                    classNameItem={css.item_skills_item}
                                    classNameAdd={css.item_skills_add}
                                    offerHints={skillList?.data?.skills || []}
                                    title="Skills"
                                    addLabel="Add Skill"
                                    dataClickId="job_card_skills"
                                    disabled={!isEdit}
                                />
                                {localData.type === 'Bounties' && (
                                    <div className={css.item_group}>
                                        <h4 className={css.item_subtitle}>Number of Winners</h4>
                                        <Input
                                            className={css.item_numberWinners}
                                            value={countWinners}
                                            onChange={onChangeWinners}
                                            disabled={!isEdit}
                                            data-analytics-click="job_card_winners_input"
                                        />
                                    </div>
                                )}
                                {localData.type === 'Task' && (
                                    <div className={css.item_group}>
                                        <h4 className={css.item_subtitle}>
                                            Number of Contributors
                                        </h4>
                                        <Input
                                            className={css.item_numberWinners}
                                            value={countContributors}
                                            onChange={onChangeContributors}
                                            disabled={!isEdit}
                                            data-analytics-click="job_card_contributors_input"
                                        />
                                    </div>
                                )}
                                <div className={css.item_group}>
                                    <h4 className={css.item_subtitle}>Payout</h4>
                                    {localData.type === 'Task' && (
                                        <>
                                            {localData.payouts?.map((p, key) => (
                                                <div className={css.payout_multipleItem} key={p.id}>
                                                    <PayoutMultiple
                                                        countApplicants={countContributors}
                                                        payout={p}
                                                        onChange={onChangePayout}
                                                        onRemove={onRemovePayout}
                                                        disabled={!isEdit}
                                                        daoId={daoid!}
                                                    />
                                                </div>
                                            ))}
                                            {isEdit && (
                                                <div className={css.payout_addItem}>
                                                    <PayoutAdd onAdd={onAddPayout} />
                                                </div>
                                            )}
                                        </>
                                    )}
                                    {localData.type === 'Bounties' && (
                                        <>
                                            <PayoutBounty
                                                payout={localData?.bountyPayouts}
                                                winners={countWinners}
                                                onChange={(payouts) => {
                                                    setLocalData({
                                                        ...localData,
                                                        bountyPayouts: [...payouts],
                                                    });
                                                }}
                                                disabled={!isEdit}
                                                hideInput
                                                daoId={daoid!}
                                            />
                                        </>
                                    )}
                                    {/* {localData.type === 'Task' && isEdit && (
                                        <button className={css.item_addPayout} onClick={addPayout}>
                                            <PlusIcon />
                                            <span>Add a New Transaction</span>
                                        </button>
                                    )} */}
                                    {daoAccess && edit && (
                                        <div style={{ marginTop: '24px' }}>
                                            <SetupWallet />
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    />
                </ul>
            </div>
            <div className={css.footer}>
                {localData.type === 'Task' && (
                    <div className={css.creator_total}>
                        <h3 className={css.creator_content_title}>Payout Summary</h3>
                        {totalPayout.length === 0 && (
                            <div className={css.creator_total_row}>
                                <p>Total Payout</p>
                                <p>----</p>
                            </div>
                        )}
                        {totalPayout.length > 0 &&
                            totalPayout.map(([currency, count]) => (
                                <>
                                    <div className={css.creator_total_row}>
                                        <p>{currency} Payout</p>
                                        <p>
                                            {currency} {count}
                                        </p>
                                    </div>
                                    <div className={css.creator_total_subText}>
                                        <p>Per Contributor</p>
                                        <p>
                                            {currency} {count / countContributors}
                                        </p>
                                    </div>
                                </>
                            ))}
                    </div>
                )}
                {localData.type === 'Bounties' && (
                    <div className={css.creator_total}>
                        <h3 className={css.creator_content_title}>Payout Summary</h3>
                        {localData.bountyPayouts.length === 0 && (
                            <div className={css.creator_total_row}>
                                <p>Total Payout</p>
                                <p>----</p>
                            </div>
                        )}
                        {localData.bountyPayouts
                            .map((item) => item.transactions[0])
                            .map((payout, index) => {
                                return (
                                    <div key={payout.id} className={css.view_payout}>
                                        <span>{positions[index].toLocaleUpperCase()} position</span>
                                        <strong>
                                            {payout.currency.name} {payout.amount}
                                        </strong>
                                    </div>
                                );
                            })}
                    </div>
                )}
                {localData.payouts.length > 0 && isEdit && (
                    <div className={css.creator_controls}>
                        <Button className={css.creator_confirmBtn} color="green" onClick={onSave}>
                            <span>Post Job</span>
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};
