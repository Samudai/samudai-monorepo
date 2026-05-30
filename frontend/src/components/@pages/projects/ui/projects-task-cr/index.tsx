import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectsMember } from '../projects-member';
import {
    ActivityEnums,
    Comment,
    ProjectColumn,
    ProjectResponse,
    SubTask,
    TaskResponse,
    NotificationsEnums,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import dayjs, { Dayjs } from 'dayjs';
import { Descendant } from 'slate';
import { useLazyGetTaskDetailsQuery } from 'store/services/projects/tasks';
import { useGetPRsMutation, useTaskUpdateMutation } from 'store/services/projects/totalProjects';
import store from 'store/store';
import { useObjectState } from 'hooks/use-object-state';
import Popup from 'components/@popups/components/Popup/Popup';
import { Editor, deserialize, serialize } from 'components/editor';
import MultiSelect from 'components/multi-select';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import DatePicker from 'ui/@form/date-picker/date-picker';
import CalendarIcon from 'ui/SVG/CalendarIcon';
import PenIcon from 'ui/SVG/PenIcon';
import ProjectProgress from 'ui/project-progress';
import { toast } from 'utils/toast';
import { IMember } from 'utils/types/User';
import { getMemberId, getRawText } from 'utils/utils';
import { ProjectsComments, ProjectsFiles, ProjectsSubtasks } from './components';
import css from './projects-task-details.module.scss';
import { PayoutItem } from '../projects-payout/components';
import { updateActivity } from 'utils/activity/updateActivity';
import { useLazyGetDepartmentsQuery } from 'store/services/Settings/settings';
import sendNotification from 'utils/notification/sendNotification';

interface ProjectsTaskDetailsProps {
    data?: TaskResponse;
    columns: ProjectColumn[];
    project: ProjectResponse;
    onClose?: () => void;
    access?: boolean;
    personal?: boolean;
    isEdit?: boolean;
}

interface Inputs {
    title: string;
    departments: {
        value: string;
        label: string;
    }[];
    deadline: Dayjs | null;
    reviewer: IMember | null;
    contributors: IMember[];
    description: Descendant[];
    subtasks: SubTask[];
    comments: Comment[];
}

type TaskTabs = 'subtasks' | 'payouts' | 'files' | 'comments';

const tabs = ['subtasks', 'payouts', 'files', 'comments'] as const;

const personalTabs = ['subtasks', 'files', 'comments'] as const;

export const ProjectsTaskDetails: React.FC<ProjectsTaskDetailsProps> = ({
    data,
    columns,
    project,
    onClose,
    access,
    personal,
    isEdit = false,
}) => {
    const { daoid, projectId } = useParams<{ daoid: string; projectId: string }>();
    const [activeTab, setActiveTab] = useState<TaskTabs>('subtasks');
    const [taskData, setTaskData] = useState<TaskResponse>(data!);
    const [getDetails] = useLazyGetTaskDetailsQuery();
    const [editMode, setEditMode] = useState(isEdit);
    const [btnLoading, setBtnLoading] = useState(false);

    const getInputs = (task: TaskResponse): Inputs => {
        return {
            title: task?.title || '',
            departments:
                task?.tags?.map((i) => {
                    return { value: i, label: i };
                }) || [],
            deadline: task?.deadline ? dayjs(task.deadline) : null,
            reviewer: task?.poc_member || null,
            contributors: task?.assignees || [],
            description: deserialize(task?.description || ''),
            subtasks: task?.subtasks || [],
            comments: task?.comments || [],
        };
    };
    const [state, setState] = useObjectState<Inputs>(getInputs(data!));

    const memberId = getMemberId();
    const [updateTask] = useTaskUpdateMutation();
    const [getPrs] = useGetPRsMutation();
    const [selectedPr, setSelectedPr] = useState<any>({});
    const [prs, setPrs] = useState<any[]>([]);
    const [fetchDepartmentList] = useLazyGetDepartmentsQuery();

    const departmentList = useMemo(() => {
        const list: string[] = [];
        if (daoid) {
            fetchDepartmentList(daoid)
                .unwrap()
                .then((res) => {
                    list.push(...res.data.map((department) => department.name));
                });
        }
        return list;
    }, [daoid]);

    const fun = async () => {
        try {
            const res = await getPrs({
                dao_id: daoid!,
                github_repos: project?.github_repos ? project?.github_repos : [],
            }).unwrap();

            setPrs(res?.data?.pull_requests || []);

            setSelectedPr(
                res?.data.pull_requests.filter((pr: any) => pr.id === taskData?.github_pr?.id)[0]
            );
        } catch (err) {
            console.log(err);
        }
    };

    const fetchDetails = async () => {
        if (data?.task_id) {
            localStorage.setItem('_taskid', data.task_id);
            localStorage.setItem('_projectid', data?.project_id);

            getDetails(data.task_id)
                .unwrap()
                .then((res) => {
                    if (!res?.data?.vc_claim?.includes(memberId)) {
                        if (res?.data?.assignee_member?.includes(memberId)) {
                            // setShowClaim(true);
                        }
                    }
                    setTaskData(res.data!);
                    setState(getInputs(res.data!));
                })
                .finally(() => {
                    localStorage.removeItem('_taskid');
                    localStorage.removeItem('_projectid');
                });
        }
    };

    const onSave = () => {
        if (!taskData || !taskData?.task_id) {
            return;
        }
        if (!state.title) {
            return toast('Attention', 5000, 'Title is required', '')();
        }
        if (!state.reviewer) {
            return toast('Attention', 5000, 'Please add Reviewer', '')();
        }

        setBtnLoading(true);

        const payload = {
            task: {
                task_id: taskData.task_id,
                project_id: taskData.project_id,
                created_by: taskData.created_by,
                poc_member_id: state?.reviewer?.member_id,
                tags: state?.departments?.map((i) => i.label),
                assignee_member: state?.contributors?.map((i) => i.member_id),
                title: state?.title,
                description: serialize(state?.description),
                description_raw: getRawText(state?.description),
                updated_by: memberId,
                deadline: state?.deadline?.toISOString(),
                // github_pr: {
                //     id: selectedPr.id,
                //     html_url: selectedPr.html_url,
                //     state: selectedPr.state,
                //     title: selectedPr.title,
                // },
            },
        };

        localStorage.setItem('_taskid', taskData.task_id);
        localStorage.setItem('_projectid', taskData.project_id);

        updateTask(payload)
            .unwrap()
            .then((res) => {
                const oldContributors = taskData.assignee_member?.filter(
                    (i) => !payload.task.assignee_member.includes(i)
                );
                const newContributors = payload.task.assignee_member?.filter(
                    (i) => !taskData.assignee_member?.includes(i)
                );
                if (oldContributors?.length) {
                    sendNotification({
                        to: oldContributors,
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: memberId,
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: taskData.task_id || '',
                            redirect_link: `/${daoid}/projects/${projectId}/board`,
                        },
                        type: NotificationsEnums.SocketEventsToServiceProject
                            .CONTRIBUTOR_REMOVED_FROM_TASK_CONTRIBUTOR,
                    });
                    sendNotification({
                        to: [daoid!],
                        for: NotificationsEnums.NotificationFor.ADMIN,
                        from: memberId,
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: taskData.task_id || '',
                            redirect_link: `/${daoid}/projects/${projectId}/board`,
                        },
                        type: NotificationsEnums.SocketEventsToServiceProject
                            .CONTRIBUTOR_REMOVED_FROM_TASK_DAO,
                    });
                }
                if (newContributors?.length) {
                    sendNotification({
                        to: newContributors,
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: memberId,
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: taskData.task_id || '',
                            redirect_link: `/${daoid}/projects/${projectId}/board`,
                        },
                        type: NotificationsEnums.SocketEventsToServiceProject
                            .TASK_ASSIGNED_TO_CONTRIBUTOR,
                    });
                }
                sendNotification({
                    to: [daoid!],
                    for: NotificationsEnums.NotificationFor.ADMIN_MEMBER,
                    from: memberId,
                    by: NotificationsEnums.NotificationCreatedby.MEMBER,
                    metadata: {
                        id: taskData.task_id || '',
                        redirect_link: `/${daoid}/projects/${projectId}/board`,
                    },
                    type: NotificationsEnums.SocketEventsToServiceProject.EDIT_IN_TASK,
                });
                updateActivity({
                    dao_id: daoid!,
                    member_id: memberId,
                    project_id: project.project_id,
                    task_id: taskData.task_id,
                    action_type: ActivityEnums.ActionType.TASK_UPDATED,
                    visibility: project.visibility!,
                    member: {
                        username: store.getState().commonReducer?.member?.data.username || '',
                        profile_picture:
                            store.getState().commonReducer?.member?.data.profile_picture || '',
                    },
                    dao: {
                        dao_name: store.getState().commonReducer?.activeDaoName || '',
                        profile_picture: store.getState().commonReducer?.profilePicture || '',
                    },
                    project: {
                        project_name: project.title,
                    },
                    task: {
                        task_name: taskData.title,
                    },
                    action: {
                        message: '',
                    },
                    metadata: {
                        id: taskData.task_id,
                        title: taskData.title,
                    },
                });
                setActiveTab('subtasks');
                setEditMode(false);
                toast('Success', 5000, 'Task updated successfully', '')();
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to update task', '')();
            })
            .finally(() => {
                localStorage.removeItem('_taskid');
                localStorage.removeItem('_projectid');
                setBtnLoading(false);
            });
    };

    useEffect(() => {
        fetchDetails();
    }, [data?.task_id]);

    useEffect(() => {
        fun();
    }, []);

    return (
        <Popup className={css.creator} dataParentId="project_task_details_sidebar">
            <form onSubmit={(ev) => ev.preventDefault()} className={css.creator_form}>
                <header className={css.creator_header}>
                    {editMode && (
                        <Input
                            className={css.creator_header_input}
                            value={state.title}
                            onChange={(ev) => setState({ title: ev.target.value })}
                            placeholder="Type title..."
                            data-analytics-click="task_details_edit_title"
                        />
                    )}
                    {!editMode && <h3 className={css.creator_header_title}>{state.title}</h3>}
                    <div className={css.creator_header_controls}>
                        {!editMode && access && (
                            <button
                                className={css.creator_header_editBtn}
                                onClick={() => setEditMode(true)}
                                type="button"
                                data-analytics-click="task_details_edit_pencil"
                            >
                                <PenIcon />
                            </button>
                        )}
                        <CloseButton
                            className={css.creator_header_closeBtn}
                            onClick={() => {
                                if (editMode) setEditMode(false);
                                else onClose?.();
                            }}
                        />
                    </div>
                </header>

                <p className={css.creator_lastupdate}>
                    <span>Last Updated</span>
                    <span data-white>{dayjs(taskData.updated_at).fromNow()}</span>
                </p>

                {!personal && (
                    <MultiSelect
                        data={state.departments}
                        onChange={(departments) => setState({ departments })}
                        className={css.creator_departments}
                        classNameItem={css.creator_departments_item}
                        classNameAdd={css.creator_departments_add}
                        maxOptions={3}
                        addLabel="Add Department"
                        data-analytics-click={
                            editMode ? 'task_details_edit_department' : 'task_details_department'
                        }
                        offerHints={departmentList}
                        disabled={!editMode}
                        voidLabel={
                            <p className={css.creator_departments_void}>
                                <span>In &ensp;</span>
                                <span data-column>
                                    {columns.find((col) => col.column_id === data?.col)?.name}
                                </span>
                                <span>&ensp; for</span>
                                {!state.departments.length && !editMode && (
                                    <span className={css.emptyText}>
                                        &ensp; No department added
                                    </span>
                                )}
                            </p>
                        }
                        box
                    />
                )}

                <div className={css.creator_deadline}>
                    <h3 className={css.creator_deadline_title}>
                        <CalendarIcon />
                        <span>Deadline</span>
                    </h3>
                    {editMode && (
                        <DatePicker
                            className={css.creator_deadline_picker}
                            value={state.deadline}
                            onChange={(deadline) => {
                                if (deadline) {
                                    if (deadline.isBefore(dayjs())) {
                                        return toast(
                                            'Attention',
                                            5000,
                                            `Invalid date selected. Please choose a future date.`,
                                            ''
                                        )();
                                    } else setState({ deadline });
                                }
                            }}
                        />
                    )}
                    {!editMode && (
                        <p className={css.creator_deadline_date}>
                            {state.deadline ? (
                                dayjs(state.deadline).format('ddd, DD MMM,YYYY')
                            ) : (
                                <div className={css.emptyText}>No deadline</div>
                            )}
                        </p>
                    )}
                </div>

                {!personal && (
                    <div className={css.creator_members}>
                        <div className={css.creator_members_col}>
                            <ProjectsMember
                                title="Reviewer*"
                                values={state.reviewer ? [state.reviewer] : []}
                                onChange={([reviewer]) => setState({ reviewer: reviewer || null })}
                                single
                                closeOnClick
                                disabled={!editMode}
                            />
                        </div>
                        <div className={css.creator_members_col}>
                            <ProjectsMember
                                values={state.contributors || []}
                                onChange={(contributors) =>
                                    setState({ contributors: contributors || null })
                                }
                                disabled={!editMode}
                                title="Contributors"
                            />
                        </div>
                    </div>
                )}

                {/* {personal && (
                    <div className={css.creator_members}>
                        <div className={css.creator_members_col}>
                            <ProjectsMember
                                title="Owner"
                                values={state.reviewer ? [state.reviewer] : []}
                                onChange={([reviewer]) => setState({ reviewer: reviewer || null })}
                                single
                                closeOnClick
                                disabled
                            />
                        </div>
                    </div>
                )} */}

                <div className={css.creator_description}>
                    <h3 className={css.creator_description_title}>Description</h3>
                    <Editor
                        className={clsx(
                            editMode
                                ? css.creator_description_editor
                                : css.creator_description_readonly
                        )}
                        classNameEditor={css.creator_description_editor_field}
                        value={state.description}
                        onChange={(description) => setState({ description })}
                        dataAnalyticsReadOnly="task_details_description"
                        dataAnalyticsEditable="edit_task_details_description"
                        readOnly={!editMode}
                        placeholder="Description"
                        emptyText="No Description Added"
                    />
                </div>

                {!editMode && (
                    <>
                        <div className={css.creator_tabs}>
                            {(personal ? personalTabs : tabs).map((tab) => (
                                <button
                                    className={clsx(
                                        css.creator_tabs_item,
                                        activeTab === tab && css.creator_tabs_itemActive
                                    )}
                                    key={tab}
                                    data-analytics-click={`task_details_${tab}_tab`}
                                    onClick={setActiveTab.bind(null, tab)}
                                >
                                    {tab === 'subtasks' && (
                                        <>
                                            <span className={css.creator_tabs_name}>Sub Task</span>
                                            <ProjectProgress
                                                className={css.creator_tabs_progress}
                                                done={0}
                                                total={state.subtasks.length}
                                            />
                                        </>
                                    )}
                                    {tab === 'payouts' && (
                                        <span className={css.creator_tabs_name}>Payout</span>
                                    )}
                                    {tab === 'files' && (
                                        <span className={css.creator_tabs_name}>Files</span>
                                    )}
                                    {tab === 'comments' && (
                                        <>
                                            <span className={css.creator_tabs_name}>Сomments</span>
                                            <strong className={css.creator_tabs_count}>
                                                {taskData?.comments?.length || 0}
                                            </strong>
                                        </>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className={css.creator_content}>
                            {activeTab === 'subtasks' && (
                                <ProjectsSubtasks
                                    columns={columns}
                                    values={state.subtasks}
                                    onChange={(subtasks) => setState({ subtasks })}
                                    taskData={data!}
                                    access={access}
                                />
                            )}
                            {activeTab === 'payouts' && taskData?.task_id && (
                                <PayoutItem
                                    link={{
                                        type: 'task',
                                        id: taskData.task_id,
                                    }}
                                    className={css.payoutItem}
                                    title={taskData.title}
                                    access={access}
                                    submit
                                />
                            )}
                            {activeTab === 'files' && taskData?.task_id && (
                                <ProjectsFiles
                                    taskId={taskData.task_id}
                                    files={taskData?.files || []}
                                    updateDetails={fetchDetails}
                                    access={access}
                                />
                            )}
                            {activeTab === 'comments' && taskData?.task_id && (
                                <ProjectsComments
                                    taskId={taskData.task_id}
                                    comments={taskData?.comments || []}
                                    updateDetails={fetchDetails}
                                    access={access}
                                />
                            )}
                        </div>
                    </>
                )}

                {editMode && (
                    <div className={css.creator_controls}>
                        <Button
                            className={css.creator_submitBtn}
                            onClick={onSave}
                            color="green"
                            isLoading={btnLoading}
                        >
                            <span>Save</span>
                        </Button>
                    </div>
                )}
            </form>
        </Popup>
    );
};
