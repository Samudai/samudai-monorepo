import { useCallback, useEffect, useState } from 'react';
import React from 'react';
import { ProjectsMember } from '../../../projects-member';
import { createSubTaskRequest } from 'store/services/projects/model';
import {
    useUpdateSubTaskColumnMutation,
    useUpdateSubTaskMutation,
} from 'store/services/projects/totalProjects';
import { useObjectState } from 'hooks/use-object-state';
import { useSubTasks } from 'components/tasks-board/lib/hooks/use-subTasks';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import PersonAddIcon from 'ui/SVG/PersonAddIcon';
import {
    ProjectColumn,
    SubTask,
    SubTaskResponse,
    TaskResponse,
} from '@samudai_xyz/gateway-consumer-types';
import PlusIcon from 'ui/SVG/PlusIcon';
import { toast } from 'utils/toast';
import { IMember } from 'utils/types/User';
import { getMemberId } from 'utils/utils';
import css from './projects-subtasks.module.scss';
import Sprite from 'components/sprite';
import Select from 'ui/@form/Select/Select';
import clsx from 'clsx';

interface ProjectsSubtasksProps {
    columns: ProjectColumn[];
    values: SubTask[];
    taskData: TaskResponse;
    onChange: (subtasks: SubTask[]) => void;
    access?: boolean;
}

interface ISubtaskCreation {
    title: string;
}

export const ProjectsSubtasks: React.FC<ProjectsSubtasksProps> = ({
    values,
    onChange,
    columns,
    taskData,
    access,
}) => {
    const [state, setState] = useObjectState<ISubtaskCreation>({
        title: '',
    });
    const [isCreation, setIsCreation] = useState(false);
    const [subTasks, setSubTasks] = useState<SubTaskResponse[]>(values);

    const member_id = getMemberId();
    const {
        createSubTask,
        subTasks: newSubTasks,
        deleteSubTask,
    } = useSubTasks(taskData?.task_id || '');
    const [updateSubTask] = useUpdateSubTaskMutation();
    const [updateColumn] = useUpdateSubTaskColumnMutation();

    const onClear = () => {
        setState({ title: '' });
        setIsCreation(false);
    };

    const onSubmit = () => {
        const currSubTasks = subTasks
            .filter((subtask) => subtask.col === columns[0].column_id)
            .sort((subtask1, subtask2) => subtask1.position - subtask2.position);

        const payload: createSubTaskRequest = {
            subtask: {
                project_id: taskData.project_id!,
                task_id: taskData.task_id!,
                title: state.title,
                created_by: member_id as string,
                poc_member_id: member_id as string,
                col: columns[0].column_id,
                position: currSubTasks.length
                    ? currSubTasks[currSubTasks.length - 1].position + 65536
                    : 65536,
            },
        };

        if (state.title.trim()) {
            createSubTask(payload);
            onChange([...subTasks, payload.subtask]);
            setSubTasks([...subTasks, payload.subtask]);
            onClear();
        }
    };

    const onMember = (index: number, members: IMember[]) => {
        const newMembers = members.map((member) => ({
            member_id: member.member_id,
            username: member.username,
            name: member.name,
            profile_picture: member.profile_picture || '',
        }));
        const newSubtasks = subTasks.map((member, id) =>
            id === index ? { ...member, assignees: newMembers } : { ...member, assignees: [] }
        );

        const payload = {
            subtask: {
                ...newSubTasks[index],
                assignee_member: members.map((m) => m.member_id),
                payout: undefined,
                updated_by: member_id,
            },
        };

        updateSubTask(payload)
            .unwrap()
            .then(() => {
                setSubTasks(newSubtasks);
                onChange(newSubtasks);
                toast('Success', 3000, 'Contributor updated successfully', '')();
            })
            .catch(() => {
                toast('Failure', 3000, 'Failed to update contributor', '')();
            });
    };

    const getColumnName = useCallback(
        (col: number) => {
            return (columns || []).find((column) => column.column_id === col)?.name;
        },
        [columns]
    );

    const getColor = (col: number) => {
        if (col % 3 === 1) return css.label_lavender;
        if (col % 3 === 2) return css.label_yellow;
        return css.label_green;
    };

    const getSelectColor = (col: number) => {
        if (col % 3 === 1) return css.select_label_lavender;
        if (col % 3 === 2) return css.select_label_yellow;
        return css.select_label_green;
    };

    const handleColumnChange = useCallback((subtask: SubTaskResponse, columnId: number) => {
        if (subtask.col === columnId) {
            return;
        }
        const oldSubtasks = [...subTasks];
        setSubTasks((subtasks) =>
            subtasks.map((item) => {
                if (subtask.subtask_id === item.subtask_id) return { ...item, col: columnId };
                else return item;
            })
        );
        updateColumn({
            subtaskId: subtask.subtask_id!,
            col: columnId,
            updated_by: member_id as string,
        })
            .unwrap()
            .then(() => {
                toast('Success', 3000, 'Status updated successfully', '')();
            })
            .catch((err) => {
                toast('Failure', 3000, 'Failed to update status', '')();
                setSubTasks(oldSubtasks);
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (newSubTasks.length) {
            setSubTasks(newSubTasks);
        }
    }, [newSubTasks]);

    console.log(subTasks, columns);

    return (
        <div className={css.subtasks}>
            <ul className={css.subtasks_list}>
                {subTasks.map((subtask, idx) => (
                    <li
                        className={css.subtasks_item}
                        key={subtask.title}
                        data-analytics-click="subtask_task_click"
                    >
                        <div className={css.subtasks_col_1}>
                            <h3 className={css.subtasks_item_title}>{subtask.title}</h3>
                        </div>

                        {/* <div className={css.subtasks_col_2}>
                            <p className={css.subtasks_item_column}>
                                {columns.find((col) => col.column_id === subtask.col)?.name}
                            </p>
                        </div> */}

                        <div className={css.subtasks_col_2}>
                            <Select
                                className={`${css.col} ${css.col_5}`}
                                closeClickOuside
                                closeClickItem
                            >
                                <Select.Button
                                    className={clsx(
                                        css.label,
                                        css.select_button,
                                        getColor(subtask.col!)
                                    )}
                                >
                                    {getColumnName(subtask.col!)}
                                </Select.Button>

                                <Select.List className={css.select_list}>
                                    {(columns || []).map((column) => (
                                        <Select.Item
                                            className={clsx(
                                                css.select_label,
                                                css.select_item,
                                                getSelectColor(column.column_id)
                                            )}
                                            onClick={() =>
                                                handleColumnChange(subtask, column.column_id)
                                            }
                                            key={column.column_id}
                                        >
                                            {column.name}
                                        </Select.Item>
                                    ))}
                                </Select.List>
                            </Select>
                        </div>

                        <div className={css.subtasks_col_3}>
                            <ProjectsMember
                                size={24}
                                edgeSide="right"
                                icon={<PersonAddIcon style={{ width: '55%', height: '55%' }} />}
                                className={css.subtasks_item_members}
                                values={subtask.assignees || []}
                                onChange={(members) => onMember(idx, members)}
                                data-analytics-click="task_details_subtask_add_contributor"
                                closeOnClick
                            />
                        </div>

                        <div className={css.subtasks_col_4}>
                            <button
                                className={css.deleteBtn}
                                onClick={() => {
                                    if (!subtask.subtask_id) {
                                        toast(
                                            'Failure',
                                            5000,
                                            'Failed to delete subtask. Please Try Again',
                                            ''
                                        )();
                                    } else deleteSubTask(subtask.subtask_id);
                                }}
                            >
                                <Sprite url="/img/sprite.svg#cross-box" />
                            </button>
                        </div>
                    </li>
                ))}
                {access && (
                    <li className={css.subtasks_item}>
                        {!isCreation && (
                            <button
                                className={css.subtasks_addBtn}
                                onClick={setIsCreation.bind(null, true)}
                                data-analytics-click="task_details_add_subtask_button"
                            >
                                <PlusIcon data-analytics-click="task_details_add_subtask_button" />
                                <span>Add a Subtask</span>
                            </button>
                        )}
                        {isCreation && (
                            <div className={css.subtasks_creation}>
                                <Input
                                    value={state.title}
                                    onChange={(ev) => setState({ title: ev.target.value })}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onSubmit();
                                        }
                                    }}
                                    className={css.subtasks_titleinput}
                                    placeholder="Enter a title for this card..."
                                    data-analytics-click="task_details_add_subtask_title"
                                />

                                <Button
                                    className={css.subtasks_submitBtn}
                                    onClick={onSubmit}
                                    color="orange"
                                    data-analytics-click="task_details_create_subtask_submit"
                                >
                                    <span>Add card</span>
                                </Button>

                                <CloseButton className={css.subtasks_cancelBtn} onClick={onClear} />
                            </div>
                        )}
                    </li>
                )}
            </ul>
        </div>
    );
};
