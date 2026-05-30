import React, { useEffect, useState } from 'react';
import { NotificationsEnums, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { ProjectOption } from 'components/@pages/projects/types';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import MultiSelect from 'components/multi-select';
import Sprite from 'components/sprite';
import { useSubtaskState } from 'components/tasks-board/providers/withSubtasks';
import CommentsIcon from 'ui/SVG/CommentsIcon';
import ProjectProgress from 'ui/project-progress';
import css from './task.module.scss';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import usePopup from 'hooks/usePopup';
import { ConfirmationModal } from '../confirmation-modals/ConfirmationModal';
import { IMember } from 'utils/types/User';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { useAssignTaskMutation } from 'store/services/projects/tasks';
import { assignTask as assignTaskType } from 'store/services/projects/model';
import sendNotification from 'utils/notification/sendNotification';
import { useParams } from 'react-router-dom';

interface TaskProps {
    data: TaskResponse;
    shaking: ProjectOption;
    fields: ('department' | 'person')[];
    cancelShaking?: () => void;
    deleteTask?: (task_id: string) => void;
    personal?: boolean;
}

export const Task: React.FC<TaskProps> = ({
    data: taskData,
    fields,
    shaking,
    deleteTask,
    cancelShaking,
    personal = false,
}) => {
    const [data, setData] = useState(taskData);
    const { subtaskState, detailState, assigneesState, payoutState, postJobState } =
        useSubtaskState();
    const { daoid } = useParams<{ daoid: string }>();

    const taskDeleteModal = usePopup();

    const [assignTask] = useAssignTaskMutation();

    const onMemberChange = (members: IMember[], member?: IMember) => {
        const payload: assignTaskType = {
            taskAssign: {
                type: 'member',
                task_id: data.task_id!,
                updated_by: getMemberId(),
                assignee_member: members.map((m) => m.member_id),
                assignee_clan: [],
                project_id: data.project_id!,
            },
        };

        const oldData = { ...data };

        setData((data) => ({
            ...data,
            assignee_member: members.map((m) => m.member_id),
            assignees: members,
        }));

        assignTask(payload)
            .unwrap()
            .then(() => {
                toast('Success', 3000, 'Contributor updated successfully', '')();
                if (member && member !== getMemberId()) {
                    sendNotification({
                        to: [member.member_id],
                        for: NotificationsEnums.NotificationFor.MEMBER,
                        from: getMemberId(),
                        by: NotificationsEnums.NotificationCreatedby.MEMBER,
                        metadata: {
                            id: data?.task_id || '',
                            redirect_link: `/${daoid}/projects/${data.project_id}/board`,
                        },
                        type: NotificationsEnums.SocketEventsToServiceProject
                            .TASK_ASSIGNED_TO_CONTRIBUTOR,
                    });
                }
            })
            .catch(() => {
                setData(oldData);
                toast('Failure', 3000, 'Failed to update contributor', '')();
            });
    };

    const handleOpen = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;
        if (target.closest('button')) return;
        if (shaking === null) {
            detailState.open(data);
        }
        if (shaking === 'payout') {
            payoutState.open(data.task_id);
            cancelShaking?.();
        }
        if (shaking === 'create-job') {
            postJobState.open(data);
            cancelShaking?.();
        }
    };

    useEffect(() => {
        setData(taskData);
    }, [taskData]);

    return (
        <>
            <div
                className={clsx(css.card, shaking !== null && css.cardShaking)}
                onClick={handleOpen}
                data-analytics-click="project_task_card"
            >
                <div className={css.card_main}>
                    <div className={css.card_left}>
                        <div className={css.card_head}>
                            <div className={css.card_grow}>
                                {!!fields.includes('department') && !!data.tags && (
                                    <MultiSelect
                                        className={css.card_departments}
                                        classNameItem={css.card_departments_item}
                                        data={data.tags?.map((i) => ({ value: i, label: i })) || []}
                                        onChange={() => {}}
                                        maxShow={1}
                                        disabled
                                    />
                                )}
                                <h3 className={css.card_title}>{data.title}</h3>
                            </div>
                        </div>
                        {fields.includes('person') && !personal && (
                            <div className={css.card_person}>
                                <ProjectsMember
                                    maxShow={4}
                                    values={data.assignees || []}
                                    size={30}
                                    onChange={onMemberChange}
                                    closeOnClick
                                />
                            </div>
                        )}
                    </div>
                    {deleteTask && (
                        <div className={css.card_right}>
                            <button
                                className={css.card_removeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    taskDeleteModal.open();
                                }}
                            >
                                <Sprite url="/img/sprite.svg#cross-box" />
                            </button>
                        </div>
                    )}
                </div>
                <div className={css.card_controls}>
                    <button
                        className={css.card_subtaskBtn}
                        onClick={() => subtaskState.open(data)}
                        data-analytics-click="project_task_subtask_button"
                    >
                        <ProjectProgress
                            done={data?.completed_subtask_count || 0}
                            total={data.subtasks?.length || 0}
                            className={css.card_progress}
                        />
                        <span>Sub-Task</span>
                    </button>
                    {!personal && (
                        <button
                            className={css.card_chatBtn}
                            onClick={() => assigneesState.open(data)}
                            data-analytics-click="project_task_chat_button"
                        >
                            <CommentsIcon />
                            <span>Chat</span>
                        </button>
                    )}
                </div>
            </div>
            {deleteTask && (
                <PopupBox active={taskDeleteModal.active} onClose={taskDeleteModal.close}>
                    <ConfirmationModal
                        type="Task"
                        taskDetails={data}
                        onConfirm={() => deleteTask(data.task_id!)}
                        onClose={taskDeleteModal.close}
                    />
                </PopupBox>
            )}
        </>
    );
};
