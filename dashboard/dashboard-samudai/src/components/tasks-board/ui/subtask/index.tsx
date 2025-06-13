import React, { useEffect, useState } from 'react';
import { useSubtaskState } from 'components/tasks-board/providers/withSubtasks';
import CommentsIcon from 'ui/SVG/CommentsIcon';
import css from './subtask.module.scss';
import { SubTaskResponse } from '@samudai_xyz/gateway-consumer-types';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { Assignees } from '../assignees';
import usePopup from 'hooks/usePopup';
import Sprite from 'components/sprite';
import { ConfirmationModal } from '../confirmation-modals/ConfirmationModal';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import { IMember } from 'utils/types/User';
import { useUpdateSubTaskMutation } from 'store/services/projects/totalProjects';
import { toast } from 'utils/toast';

interface SubtaskProps {
    data: SubTaskResponse;
    deleteSubTask?: (subtask_id: string) => void;
    personal?: boolean;
}

export const Subtask: React.FC<SubtaskProps> = ({
    data: subtaskData,
    deleteSubTask,
    personal = false,
}) => {
    const [data, setData] = useState(subtaskData);

    const { subtaskDetailState } = useSubtaskState();
    const assigneesState = usePopup();
    const subtaskDeleteModal = usePopup();

    const [updateSubTask] = useUpdateSubTaskMutation();

    const onMemberChange = (members: IMember[]) => {
        const payload = {
            subtask: {
                ...data,
                assignee_member: members.map((m) => m.member_id),
                payout: undefined,
            },
        };

        const oldData = { ...data };

        setData((data) => ({
            ...data,
            assignee_member: members.map((m) => m.member_id),
            assignees: members,
        }));

        updateSubTask(payload)
            .unwrap()
            .then(() => {
                toast('Success', 3000, 'Contributor updated successfully', '')();
            })
            .catch(() => {
                setData(oldData);
                toast('Failure', 3000, 'Failed to update contributor', '')();
            });
    };

    const handleOpen = (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;
        if (target.closest('button')) return;
        subtaskDetailState.open(data);
    };

    useEffect(() => {
        setData(subtaskData);
    }, [subtaskData]);

    return (
        <>
            <div
                className={css.card}
                onClick={handleOpen}
                data-card
                data-analytics-click="subtask_card_click"
            >
                <div className={css.card_top}>
                    <h3 className={css.card_title}>{data.title}</h3>
                    {deleteSubTask && (
                        <div className={css.card_right}>
                            <button
                                className={css.card_removeBtn}
                                onClick={subtaskDeleteModal.open}
                            >
                                <Sprite url="/img/sprite.svg#cross-box" />
                            </button>
                        </div>
                    )}
                </div>
                {!personal && (
                    <div className={css.card_row}>
                        <div className={css.card_contributor}>
                            <ProjectsMember
                                maxShow={4}
                                values={data.assignees || []}
                                size={30}
                                onChange={onMemberChange}
                                closeOnClick
                            />
                        </div>

                        <button
                            className={css.card_commentsBtn}
                            onClick={assigneesState.open}
                            data-analytics-click="subtask_card_chat"
                        >
                            <CommentsIcon />
                            <span>Chat</span>
                        </button>
                    </div>
                )}
            </div>
            <PopupBox
                active={assigneesState.active}
                onClose={assigneesState.close}
                effect="side"
                children={<Assignees subtaskData={data} onClose={assigneesState.close} />}
            />
            {deleteSubTask && (
                <PopupBox active={subtaskDeleteModal.active} onClose={subtaskDeleteModal.close}>
                    <ConfirmationModal
                        type="Subtask"
                        subtaskDetails={data}
                        onConfirm={() => deleteSubTask(data.subtask_id!)}
                        onClose={subtaskDeleteModal.close}
                    />
                </PopupBox>
            )}
        </>
    );
};
