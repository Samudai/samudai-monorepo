import React, { useEffect, useState } from 'react';
import { useBounty, useJobs } from '../../libs/hooks';
import { JobsPayout } from '../jobs-payout';
import { JobsSkills } from '../jobs-skills';
import {
    AccessEnums,
    BountyResponse,
    JobsEnums,
    OpportunityResponse,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { Descendant } from 'slate';
import {
    selectAccess,
    selectAccessList,
    selectDaoList,
    selectDaoProgress,
    selectMemberData,
    selectRoles,
} from 'store/features/common/slice';
import { updateSelectDao } from 'store/features/jobs/slice';
import { createBountyRequest, createOpportunityRequest } from 'store/services/jobs/model';
import { useGetSkillListForJobQuery } from 'store/services/jobs/totalJobs';
import { useLazyGetTasksByProjectIdQuery } from 'store/services/projects/totalProjects';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useObjectState } from 'hooks/use-object-state';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import Popup from 'components/@popups/components/Popup/Popup';
import { Editor, deserialize, serialize } from 'components/editor';
import { PayoutBounty, PayoutMultiple, PayoutSingle } from 'components/payout';
import { PayoutTotal } from 'components/payout';
import { createPayoutDef, getPositions, totalPayout } from 'components/payout/lib';
import { IBountyPayout, IPayout } from 'components/payout/types';
import { PayoutAdd } from 'components/payout/ui/payout-add';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import Select from 'ui/@form/Select/Select';
import DatePicker from 'ui/@form/date-picker/date-picker';
import { toast } from 'utils/toast';
import { IMember } from 'utils/types/User';
import { getMemberId, getRawText } from 'utils/utils';
import viewModalCss from '../jobs-view-modal/jobs-view-modal.module.scss';
import css from './jobs-add-modal.module.scss';
import SetupWallet from 'components/@pages/payments/SetupWallet';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import mixpanel from 'utils/mixpanel/mixpanelInit';

interface JobsAddModalProps {
    type: 'task' | 'bounty';
    jobData?: OpportunityResponse;
    bountyData?: BountyResponse;
    isEdit?: boolean;
    onClose: () => void;
}

interface SelectOption {
    value: string;
    label: string;
}

interface Inputs {
    title: string;
    reviewer: IMember | null;
    description: Descendant[];
    skills: string[];
    multipleApplicants: boolean;
    countApplicants: number | null;
    countWinners: number | null;
    associated_dao: SelectOption | null;
    associated_project: SelectOption | null;
    associated_task: SelectOption | null;
    payout: IPayout[];
    bountyPayout: IBountyPayout[];
    deadline: Dayjs;
}

const optionApplicants = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
];

export const JobsAddModal: React.FC<JobsAddModalProps> = ({
    type,
    jobData,
    bountyData,
    isEdit,
    onClose,
}) => {
    const [tab, setTab] = useState('File');
    const [isPayout, setIsPayout] = useState(false);
    const [confirmedPayout, setConfirmedPayout] = useState(false);
    const [state, setState] = useObjectState<Inputs>({
        title: '',
        reviewer: null,
        description:
            type === 'task'
                ? deserialize(jobData?.description || '')
                : deserialize(bountyData?.description || ''),
        skills: [],
        multipleApplicants: false,
        countApplicants: null,
        countWinners: null,
        associated_dao: null,
        associated_project: null,
        associated_task: null,
        payout: [],
        bountyPayout: [],
        deadline: dayjs(),
    });
    const [daoList, setDaoList] = useState<SelectOption[]>([]);
    const [projectList, setProjectList] = useState<SelectOption[]>([]);
    const [taskList, setTaskList] = useState<SelectOption[]>([]);
    const [btnLoading, setBtnLoading] = useState<boolean>(false);

    const memberId = getMemberId();
    const { createOpportunity, updateOpportunity } = useJobs();
    const { createBounty, updateBounty } = useBounty();
    const DAOList = useTypedSelector(selectDaoList);
    const DAOAccessList = useTypedSelector(selectAccessList);
    const roles = useTypedSelector(selectRoles);
    const member_id = getMemberId();
    const [getProjects] = useGetProjectByMemberIdMutation();
    const [getTasks] = useLazyGetTasksByProjectIdQuery();
    const dispatch = useTypedDispatch();
    const { data: skillList } = useGetSkillListForJobQuery();
    const memberData = useTypedSelector(selectMemberData);
    const positions = getPositions();
    const daoProgress = useTypedSelector(selectDaoProgress);
    const daoAccess = useTypedSelector(selectAccess)?.includes(AccessEnums.AccessType.MANAGE_DAO);

    useEffect(() => {
        const myDetails = {
            member_id,
            name: memberData?.name || '',
            profile_picture: memberData?.profile_picture || '',
            username: memberData?.username || '',
        };
        setState({ reviewer: myDetails });
    }, [memberData, member_id]);

    useEffect(() => {
        if (DAOList.length) {
            setDaoList(
                DAOList.filter(
                    (dao) =>
                        DAOAccessList[dao.id]?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
                        DAOAccessList[dao.id]?.includes(AccessEnums.AccessType.MANAGE_JOB)
                ).map((dao) => ({
                    label: dao.name,
                    value: dao.id,
                }))
            );
        }
    }, [DAOList, DAOAccessList]);

    useEffect(() => {
        if (state.associated_dao) {
            if (!daoList.map((dao) => dao.value).includes(state.associated_dao.value)) {
                setDaoList([...daoList, state.associated_dao]);
            }
            dispatch(updateSelectDao(state.associated_dao.value));
            const payload = {
                member_id: member_id,
                daos: [
                    {
                        dao_id: state.associated_dao.value,
                        roles,
                    },
                ],
            };
            getProjects(payload)
                .unwrap()
                .then((res) => {
                    setProjectList(
                        res?.data
                            .filter((val) => val.access !== 'hidden')
                            .map((project) => ({
                                label: project.title,
                                value: project.project_id!,
                            }))
                    );
                    if (jobData?.dao_id === state.associated_dao?.value) {
                        const currProject = res.data.find(
                            (val) => val.project_id === jobData?.project_id
                        );
                        if (currProject && currProject?.project_id)
                            setState({
                                associated_project: {
                                    label: currProject.title,
                                    value: currProject.project_id,
                                },
                            });
                    }
                    if (bountyData?.dao_id === state.associated_dao?.value) {
                        const currProject = res.data.find(
                            (val) => val.project_id === bountyData?.project_id
                        );
                        if (currProject && currProject?.project_id)
                            setState({
                                associated_project: {
                                    label: currProject.title,
                                    value: currProject.project_id,
                                },
                            });
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [state.associated_dao]);

    // useEffect(() => {
    //     if (state.associated_project) {
    //         getTasks(state.associated_project.value!)
    //             .unwrap()
    //             .then((res) => {
    //                 setTaskList(
    //                     res?.data?.map(task => ({label: task.title, value: task.task_id!})) || []
    //                 );
    //                 if (jobData?.project_id === state.associated_project?.value) {
    //                     const currTask = res.data?.find(val => val.task_id === jobData?.task_id);
    //                     if (currTask)
    //                         setState({associated_task: { label: currTask.title, value: currTask.task_id! }})
    //                 }
    //                 if (bountyData?.project_id === state.associated_project?.value) {
    //                     const currTask = res.data?.find(val => val.task_id === bountyData?.task_id);
    //                     if (currTask)
    //                         setState({associated_task: { label: currTask.title, value: currTask.task_id! }})
    //                 }
    //             })
    //             .catch((err) => {
    //                 console.error(err);
    //             })
    //     }
    // }, [state.associated_project]);

    useEffect(() => {
        if (jobData) {
            setState({
                title: jobData?.title,
                reviewer: jobData?.poc_member,
                description: deserialize(jobData?.description || ''),
                skills: jobData?.skills,
                multipleApplicants: jobData?.req_people_count > 1,
                countApplicants: jobData?.req_people_count,
                associated_dao: { value: jobData.dao_id, label: jobData.dao_name },
                payout: jobData?.payout?.map((payout) => {
                    return {
                        id: payout.payout_id,
                        provider: payout.provider_id,
                        amount: payout.payout_amount,
                        currency: payout.payout_currency,
                    };
                }),
            });
        } else if (bountyData) {
            const newBountyPayout = [...(bountyData?.payout || [])];
            setState({
                title: bountyData?.title,
                reviewer: bountyData?.poc_member,
                description: deserialize(bountyData?.description || ''),
                skills: bountyData?.skills,
                countWinners: bountyData?.winner_count,
                associated_dao: { value: bountyData.dao_id, label: bountyData.dao_name },
                bountyPayout: newBountyPayout?.map((payout, index) => {
                    return {
                        id: payout.payout_id,
                        position: index + 1,
                        transactions: [
                            {
                                id: payout.payout_id,
                                provider: payout.provider_id,
                                amount: payout.payout_amount,
                                currency: payout.payout_currency,
                            },
                        ],
                    };
                }),
                deadline: bountyData?.end_date ? dayjs(bountyData?.end_date) : dayjs(),
            });
        }
    }, [jobData, bountyData, daoList]);

    const changePayout = (payout: IPayout) => {
        setState({ payout: state.payout.map((p) => (p.id === payout.id ? payout : p)) });
    };

    const removePayout = (payout: IPayout) => {
        setState({ payout: state.payout.filter((p) => p.id !== payout.id) });
    };

    const addPayout = () => {
        setState({ payout: [...state.payout, createPayoutDef()] });
    };

    const confirmPayout = () => {
        setConfirmedPayout(true);
        onSubmit();
    };

    const checkPayoutDetails = (payout: IPayout[]) => {
        let check = true;
        payout.forEach((item) => {
            if (!item.amount || !item.provider || !item.currency.name) {
                check = false;
            }
        });
        return check;
    };

    const onSubmit = async () => {
        setBtnLoading(true);
        if (type === 'task') {
            if (!state.payout.length) {
                return toast('Attention', 5000, 'Please add payout', '')();
            }
            if (!checkPayoutDetails(state.payout)) {
                return toast('Attention', 5000, 'Please enter all valid payout details', '')();
            }
            if (jobData) {
                const payload: createOpportunityRequest = {
                    opportunity: {
                        ...jobData,
                        title: state.title,
                        description: serialize(state.description),
                        description_raw: getRawText(state.description),
                        created_by: jobData.created_by.member_id,
                        updated_by: memberId,
                        req_people_count: state.multipleApplicants ? state.countApplicants! : 1,
                        payout: state.payout.map((payout) => {
                            return {
                                payout_amount: +payout.amount,
                                payout_currency: payout.currency,
                                provider_id: payout.provider,
                                completed: false,
                                status: JobsEnums.JobPayoutStatus.UNASSIGNED,
                            };
                        }),
                        poc_member_id: state.reviewer?.member_id,
                        skills: state.skills,
                    },
                };

                updateOpportunity(payload)
                    .then(() => onClose())
                    .finally(() => setBtnLoading(false));
            } else {
                const payload: createOpportunityRequest = {
                    opportunity: {
                        dao_id: state.associated_dao?.value || '',
                        project_id: state.associated_project?.value,
                        // task_id: state.associated_task?.value,
                        type: JobsEnums.JobType.TASK,
                        title: state.title,
                        description: serialize(state.description),
                        description_raw: getRawText(state.description),
                        created_by: memberId,
                        visibility: JobsEnums.Visibility.PUBLIC,
                        status: JobsEnums.JobStatus.OPEN,
                        req_people_count: state.multipleApplicants ? state.countApplicants! : 1,
                        payout: state.payout.map((payout) => {
                            return {
                                payout_amount: +payout.amount,
                                payout_currency: payout.currency,
                                provider_id: payout.provider,
                                completed: false,
                                status: JobsEnums.JobPayoutStatus.UNASSIGNED,
                            };
                        }),
                        poc_member_id: state.reviewer?.member_id,
                        skills: state.skills,
                        tags: [],
                        captain: false,
                        experience: 0,
                        open_to: Object.values(JobsEnums.OpportunityOpenTo),
                        job_format: JobsEnums.JobFormat.FREELANCE,
                    },
                };

                createOpportunity(payload)
                    .then(() => {
                        mixpanel.track('job_posted', {
                            dao_id: payload.opportunity.dao_id!,
                            member_id: getMemberId(),
                            timestamp: new Date().toUTCString(),
                        });

                        onClose();
                    })
                    .finally(() => setBtnLoading(false));
            }
        } else {
            if (!state.bountyPayout.length) {
                return toast('Attention', 5000, 'Please add payout', '')();
            }
            if (!checkPayoutDetails(state.bountyPayout.map((item) => item.transactions[0]))) {
                return toast('Attention', 5000, 'Please enter all payout details', '')();
            }

            if (bountyData) {
                const payload: createBountyRequest = {
                    bounty: {
                        ...bountyData,
                        title: state.title,
                        description: serialize(state.description),
                        description_raw: getRawText(state.description),
                        winner_count: state.countWinners!,
                        created_by: bountyData.created_by.member_id,
                        updated_by: memberId,
                        end_date: state.deadline.toISOString(),
                        payout: state.bountyPayout.map((payout, index) => {
                            return {
                                payout_amount: +payout.transactions[0].amount,
                                payout_currency: payout.transactions[0].currency,
                                provider_id: payout.transactions[0].provider,
                                completed: false,
                                status: JobsEnums.JobPayoutStatus.UNASSIGNED,
                                rank: index + 1,
                            };
                        }),
                        poc_member_id: state.reviewer?.member_id,
                        skills: state.skills,
                    },
                };

                updateBounty(payload)
                    .then(() => onClose())
                    .finally(() => setBtnLoading(false));
            } else {
                const payload: createBountyRequest = {
                    bounty: {
                        dao_id: state.associated_dao?.value || '',
                        project_id: state.associated_project?.value,
                        // task_id: state.associated_task?.value,
                        title: state.title,
                        description: serialize(state.description),
                        description_raw: getRawText(state.description),
                        winner_count: state.countWinners!,
                        created_by: memberId,
                        visibility: JobsEnums.Visibility.PUBLIC,
                        status: JobsEnums.JobStatus.OPEN,
                        end_date: state.deadline.toISOString(),
                        payout: state.bountyPayout.map((payout, index) => {
                            return {
                                payout_amount: +payout.transactions[0].amount,
                                payout_currency: payout.transactions[0].currency,
                                provider_id: payout.transactions[0].provider,
                                completed: false,
                                status: JobsEnums.JobPayoutStatus.UNASSIGNED,
                                rank: index + 1,
                            };
                        }),
                        poc_member_id: state.reviewer?.member_id,
                        skills: state.skills,
                        tags: [],
                    },
                };
                createBounty(payload)
                    .then(() => {
                        mixpanel.track('job_posted', {
                            dao_id: payload.bounty.dao_id!,
                            member_id: getMemberId(),
                            timestamp: new Date().toUTCString(),
                        });
                        onClose();
                    })
                    .finally(() => setBtnLoading(false));
            }
        }
    };

    return (
        <Popup className={css.creator} dataParentId="jobs_add_modal">
            <div className={css.head}>
                <Input
                    className={css.head_input}
                    value={state.title}
                    onChange={(ev) => setState({ title: ev.target.value })}
                    placeholder="Add Job Title*"
                    autoFocus
                    data-analytics-click="job_title_input"
                />
                <CloseButton onClick={onClose} />
            </div>

            <ProjectsMember
                className={css.reviewer}
                values={state.reviewer ? [state.reviewer] : []}
                onChange={([reviewer]) => setState({ reviewer: reviewer || null })}
                title="Reviewer*"
                single
                closeOnClick
            />

            <div className={css.creator_item}>
                <h3 className={css.creator_title}>Description*</h3>
                <Editor
                    placeholder="Enter your text"
                    className={css.editor}
                    value={state.description}
                    onChange={(value) => setState({ description: value })}
                    dataAnalyticsEditable="jobs_description"
                />
            </div>

            <div className={css.creator_item}>
                <h3 className={css.creator_title}>Skills*</h3>
                <JobsSkills
                    values={state.skills}
                    onChange={(skills) => setState({ skills })}
                    hints={skillList?.data?.skills || []}
                />
            </div>

            {type === 'task' && (
                <div className={css.creator_item}>
                    <div className={css.creator_row}>
                        <div className={css.creator_col}>
                            <h3 className={css.creator_title}>Multiple Applicants</h3>
                            <Select
                                className={`${css.select} ${css.selectApplicants}`}
                                closeClickItem
                                closeClickOuside
                            >
                                <Select.Button className={css.select_button} arrow>
                                    {state.multipleApplicants ? 'Yes' : 'No'}
                                </Select.Button>
                                <Select.List className={css.select_list}>
                                    {optionApplicants.map((item) => (
                                        <Select.Item
                                            className={clsx(
                                                css.select_option,
                                                item.value === state.multipleApplicants &&
                                                    css.select_optionActive
                                            )}
                                            onClick={() =>
                                                setState({ multipleApplicants: item.value })
                                            }
                                            key={item.label}
                                        >
                                            {item.label}
                                        </Select.Item>
                                    ))}
                                </Select.List>
                            </Select>
                        </div>
                        {state.multipleApplicants && (
                            <div className={css.creator_col} data-margin>
                                <h3 className={css.creator_title}>Number of Applicants*</h3>
                                <Input
                                    value={
                                        state.countApplicants === null ? '' : state.countApplicants
                                    }
                                    onChange={(ev) => {
                                        const value = ev.target.value;
                                        if (value === '') setState({ countApplicants: null });
                                        else {
                                            const num = +value ? (+value >= 10 ? 10 : +value) : 0;
                                            setState({ countApplicants: num });
                                        }
                                    }}
                                    className={css.count_applicants}
                                    placeholder="Value..."
                                    data-analytics-click="number_of_applicants_input"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {type === 'bounty' && (
                <div className={css.creator_item}>
                    <div className={css.creator_row} data-spacer>
                        <div className={css.creator_col}>
                            <h3 className={css.creator_title}>Number of Winners*</h3>
                            <Input
                                className={css.count_winners}
                                value={state.countWinners === null ? '' : state.countWinners}
                                onChange={(ev) => {
                                    const value = ev.target.value;
                                    if (value === '') setState({ countWinners: null });
                                    else {
                                        const num = +value ? (+value >= 10 ? 10 : +value) : 0;
                                        setState({ countWinners: num });
                                    }
                                }}
                                placeholder="Value..."
                            />
                        </div>
                        <div className={css.creator_col}>
                            <h3 className={css.creator_title}>Deadline*</h3>
                            <DatePicker
                                position="right"
                                className={css.deadline}
                                value={state.deadline}
                                onChange={(deadline) => deadline && setState({ deadline })}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className={css.creator_item}>
                <h3 className={css.creator_title}>Associated DAO*</h3>

                <Select className={css.select} closeClickItem closeClickOuside>
                    <Select.Button className={css.select_button} arrow>
                        {state.associated_dao ? (
                            state.associated_dao.label
                        ) : (
                            <strong>Choose dao...</strong>
                        )}
                    </Select.Button>
                    <Select.List className={css.select_list}>
                        {daoList.map((item) => (
                            <Select.Item
                                className={clsx(
                                    css.select_option,
                                    item.value === state.associated_dao?.value &&
                                        css.select_optionActive
                                )}
                                onClick={() => setState({ associated_dao: item })}
                                key={item.value}
                            >
                                {item.label}
                            </Select.Item>
                        ))}
                    </Select.List>
                </Select>
            </div>

            {Boolean(state.associated_dao) && (
                <div className={css.creator_item}>
                    <h3 className={css.creator_title}>Associated Project*</h3>

                    <Select className={css.select} closeClickItem closeClickOuside>
                        <Select.Button className={css.select_button} arrow>
                            {state.associated_project ? (
                                state.associated_project.label
                            ) : (
                                <strong>Choose project...</strong>
                            )}
                        </Select.Button>
                        <Select.List className={css.select_list}>
                            {projectList.map((item) => (
                                <Select.Item
                                    className={clsx(
                                        css.select_option,
                                        item.value === state.associated_project?.value &&
                                            css.select_optionActive
                                    )}
                                    onClick={() => setState({ associated_project: item })}
                                    key={item.value}
                                >
                                    {item.label}
                                </Select.Item>
                            ))}
                        </Select.List>
                    </Select>
                </div>
            )}

            {isEdit && (
                <>
                    {type === 'task' ? (
                        <div className={css.creator_item}>
                            <PayoutTotal
                                data={totalPayout(state.payout)}
                                count={state.countApplicants || 1}
                            />
                        </div>
                    ) : (
                        <div className={viewModalCss.view_item}>
                            <p className={viewModalCss.deadline}>
                                <span>Total Payout</span>
                                {state.bountyPayout
                                    .map((item) => item.transactions)
                                    .flat()
                                    ?.map((payout, i) => {
                                        return (
                                            <div
                                                key={payout.id}
                                                className={viewModalCss.view_payout}
                                            >
                                                <span>
                                                    {positions[i].toLocaleUpperCase()} position
                                                </span>
                                                <strong>
                                                    {payout.currency.name} {payout.amount}
                                                </strong>
                                            </div>
                                        );
                                    })}
                            </p>
                        </div>
                    )}
                </>
            )}

            {/* {Boolean(state.associated_project) && (
                <div className={css.creator_item}>
                    <h3 className={css.creator_title}>Associated Task</h3>

                    <Select className={css.select} closeClickItem closeClickOuside>
                        <Select.Button className={css.select_button} arrow>
                            {state.associated_task ? (
                                state.associated_task.label
                            ) : (
                                <strong>Choose task...</strong>
                            )}
                        </Select.Button>
                        <Select.List className={css.select_list}>
                            {taskList.map((item) => (
                                <Select.Item
                                    className={clsx(
                                        css.select_option,
                                        item.value === state.associated_task?.value &&
                                            css.select_optionActive
                                    )}
                                    onClick={() => setState({ associated_task: item })}
                                    key={item.value}
                                >
                                    {item.label}
                                </Select.Item>
                            ))}
                        </Select.List>
                    </Select>
                </div>
            )} */}

            {/* {type === 'bounty' && (
                <div className={css.extra}>
                    <Tabs
                        className={css.extra_tabs}
                        activeTab={tab}
                        tabs={[{ name: 'File' }]}
                        onChange={(tab) => setTab(tab.name)}
                    />
                    {tab === 'File' && (
                        <div className={css.files}>
                            <FileInput className={css.files_input}>
                                <Sprite url="/img/sprite.svg#plus" />
                                <span>Add a File</span>
                            </FileInput>
                        </div>
                    )}
                </div>
            )} */}

            <div className={css.controls}>
                {!isEdit && (
                    <Button
                        className={css.controls_setupBtn}
                        data-analytics-click="setup_payout_button"
                        onClick={() => {
                            if (state.title === '') {
                                return toast('Attention', 5000, 'Please enter a valid title', '')();
                            } else if (!state.reviewer) {
                                return toast('Attention', 5000, 'Please add a reviewer', '')();
                            } else if (!getRawText(state.description)) {
                                return toast('Attention', 5000, 'Please add description', '')();
                            } else if (!state.skills.length) {
                                return toast('Attention', 5000, 'Please add skills', '')();
                            } else if (
                                type === 'task' &&
                                state.multipleApplicants &&
                                state.countApplicants === null
                            ) {
                                toast('Attention', 5000, 'Please enter number of applicants', '')();
                            } else if (
                                type === 'task' &&
                                state.multipleApplicants &&
                                state.countApplicants !== null &&
                                state.countApplicants < 2
                            ) {
                                toast(
                                    'Attention',
                                    5000,
                                    'Number of applicants should be more than 2',
                                    ''
                                )();
                            } else if (type === 'bounty' && state.countWinners === null) {
                                toast('Attention', 5000, 'Please enter number of winners', '')();
                            } else if (
                                type === 'bounty' &&
                                state.countWinners !== null &&
                                state.countWinners < 1
                            ) {
                                toast(
                                    'Attention',
                                    5000,
                                    'Number of winners should be more than equal to 1',
                                    ''
                                )();
                            } else if (type === 'bounty' && !state.deadline) {
                                toast('Attention', 5000, 'Please add deadline', '')();
                            } else if (
                                type === 'bounty' &&
                                !!state.deadline &&
                                state.deadline.diff(dayjs(), 'day') < 0
                            ) {
                                toast(
                                    'Attention',
                                    5000,
                                    `Invalid Date! Deadline can't be a past date`,
                                    ''
                                )();
                            } else if (!state.associated_dao) {
                                toast('Attention', 5000, 'Please select dao', '')();
                            } else if (state.associated_dao && !state.associated_project) {
                                return toast(
                                    'Attention',
                                    5000,
                                    'Please select an associated project',
                                    ''
                                )();
                            } else {
                                setIsPayout.bind(null, true)();
                            }
                        }}
                        color={
                            state.bountyPayout.length > 0 || state.payout.length > 0
                                ? 'orange-outlined'
                                : 'green'
                        }
                        // color="orange-outlined"
                    >
                        <span>Set Up Payout</span>
                    </Button>
                )}
                {(isEdit ||
                    (!isEdit && (state.bountyPayout.length > 0 || state.payout.length > 0))) && (
                    <Button
                        className={css.controls_setupBtn}
                        data-analytics-click={jobData || bountyData ? 'Update' : 'Create'}
                        onClick={onSubmit}
                        color="green"
                        isLoading={btnLoading}
                    >
                        <span>{jobData || bountyData ? 'Update' : 'Create'}</span>
                    </Button>
                )}
                {/* {!confirmedPayout && (
                    <Button
                        className={css.controls_setupBtn}
                        onClick={setIsPayout.bind(null, true)}
                        color="green"
                    >
                        <span>Set Up Payout</span>
                    </Button>
                )}
                {confirmedPayout && (
                    <Button
                        className={css.controls_setupBtn}
                        onClick={onSubmit}
                        color="green"
                    >
                        <span>Apply Edits</span>
                    </Button>
                )} */}
            </div>

            <PopupBox
                effect="side"
                active={isPayout}
                onClose={setIsPayout.bind(null, false)}
                enableScrollOnActive
            >
                <>
                    <Popup className={css.payout}>
                        {type === 'task' &&
                            state.multipleApplicants &&
                            state.associated_dao?.value && (
                                <JobsPayout
                                    type="task"
                                    onClose={setIsPayout.bind(null, false)}
                                    onConfirm={confirmPayout}
                                    totalPayout={totalPayout(state.payout)}
                                    applicantCount={state.countApplicants || 1}
                                    renderPayout={
                                        <>
                                            {state.payout.map((p) => (
                                                <div className={css.payout_multipleItem} key={p.id}>
                                                    <PayoutMultiple
                                                        countApplicants={
                                                            state.countApplicants
                                                                ? state.countApplicants
                                                                : 0
                                                        }
                                                        payout={p}
                                                        onChange={changePayout}
                                                        onRemove={removePayout}
                                                        daoId={state.associated_dao?.value || ''}
                                                    />
                                                </div>
                                            ))}
                                            <div className={css.payout_addItem}>
                                                <PayoutAdd onAdd={addPayout} />
                                            </div>
                                            {daoAccess && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <SetupWallet />
                                                </div>
                                            )}
                                        </>
                                    }
                                />
                            )}

                        {type === 'task' &&
                            !state.multipleApplicants &&
                            state.associated_dao?.value && (
                                <JobsPayout
                                    type="task"
                                    onClose={setIsPayout.bind(null, false)}
                                    onConfirm={confirmPayout}
                                    totalPayout={totalPayout(state.payout)}
                                    applicantCount={state.countApplicants || 1}
                                    renderPayout={
                                        <>
                                            <PayoutSingle
                                                payout={state.payout}
                                                onChange={(payout) => setState({ payout })}
                                                daoId={state.associated_dao.value}
                                            />
                                            {daoAccess && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <SetupWallet />
                                                </div>
                                            )}
                                        </>
                                    }
                                />
                            )}

                        {type === 'bounty' && state.associated_dao?.value && (
                            <JobsPayout
                                type="bounty"
                                onClose={setIsPayout.bind(null, false)}
                                onConfirm={confirmPayout}
                                totalPayout={totalPayout(
                                    state.bountyPayout.map((item) => item.transactions).flat()
                                )}
                                bountyPayout={state.bountyPayout}
                                renderPayout={
                                    <>
                                        <PayoutBounty
                                            payout={state.bountyPayout || []}
                                            winners={state.countWinners ? state.countWinners : 0}
                                            onChange={(bountyPayout) => setState({ bountyPayout })}
                                            daoId={state.associated_dao.value}
                                        />
                                        {daoAccess && (
                                            <div style={{ marginTop: '16px' }}>
                                                <SetupWallet />
                                            </div>
                                        )}
                                    </>
                                }
                            />
                        )}
                    </Popup>
                </>
            </PopupBox>
        </Popup>
    );
};
