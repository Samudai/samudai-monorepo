import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import Sprite from 'components/sprite';
import dayjs from 'dayjs';
import React, { useCallback, useMemo, useState } from 'react';
import ProjectProgress from 'ui/project-progress';
import css from './projects-item.module.scss';
import { AccessEnums, TaskResponse } from '@samudai_xyz/gateway-consumer-types';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { Assignees } from 'components/tasks-board/ui/assignees';
import usePopup from 'hooks/usePopup';
import { SubtasksBoardPersonal } from 'components/tasks-board/ui/subtasks-board-personal';
import Select from 'ui/@form/Select/Select';
import clsx from 'clsx';
import { useFetchProfileProjects } from '../../lib/hooks';
import { getMemberId } from 'utils/utils';
import { useTypedSelector } from 'hooks/useStore';
import { selectAccessList } from 'store/features/common/slice';
import { toast } from 'utils/toast';

interface ProjectsItemProps {
    data: TaskResponse;
}

export const ProjectsItem: React.FC<ProjectsItemProps> = ({ data }) => {
    const [selectedColumn, setSelectedColumn] = useState(data.col);

    const subtaskState = usePopup();
    const assigneesState = usePopup();
    const { updateAssignedTaskColumn } = useFetchProfileProjects();
    const daoAccess = useTypedSelector(selectAccessList)?.[data?.dao_id || ''];

    const columns = useMemo(() => {
        return data?.columns || [];
    }, [data?.columns]);

    const access = useMemo(
        () =>
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_DAO) ||
            daoAccess?.includes(AccessEnums.AccessType.MANAGE_PROJECT) ||
            data.poc_member_id === getMemberId(),
        [data]
    );

    const getColumnName = useCallback(
        (col: number) => {
            return (data.columns || []).find((column) => column.column_id === col)?.name;
        },
        [data.columns]
    );

    const getColor = (col: number) => {
        if (col % 3 === 1) return css.label_lavender;
        if (col % 3 === 2) return css.label_yellow;
        return css.label_green;
    };

    const handleColumnChange = useCallback(
        (columnId: number) => {
            if (
                (columnId === columns[columns.length - 1].column_id ||
                    data.col === columns[columns.length - 1].column_id) &&
                !access
            ) {
                return toast('Attention', 3000, `You don't have access for this action`, '')();
            }
            const lastColumnId = [...columns].sort((a, b) => b.column_id - a.column_id)[0]
                .column_id;
            data?.task_id && updateAssignedTaskColumn(data.task_id, columnId, lastColumnId);
            setSelectedColumn(columnId);
        },
        [data?.task_id]
    );

    return (
        <div className={css.root}>
            <div className={`${css.col} ${css.col_1}`}>
                <h3 className={css.title}>{data.title}</h3>
                <p className={css.typeAndDao}>
                    <span>{data?.dao_name}</span>
                    <span>{data?.project_name}</span>
                </p>
            </div>

            <div className={`${css.col} ${css.col_2}`}>
                <ProjectsMember values={data.assignees || []} disabled maxShow={4} />

                <button className={css.chatBtn} onClick={assigneesState.open}>
                    <Sprite url="/img/sprite.svg#message" />
                </button>
            </div>

            <div className={`${css.col} ${css.col_3}`}>
                {data?.deadline ? (
                    <p className={css.deadline}>{dayjs(data.deadline).format('MMM DD')}</p>
                ) : (
                    <p className={css.empty_deadline}>No deadline assigned</p>
                )}
            </div>

            <div className={`${css.col} ${css.col_4}`}>
                <button className={css.progress} onClick={subtaskState.open}>
                    <ProjectProgress
                        className={css.progress_val}
                        done={data?.completed_subtask_count || 0}
                        total={data.subtasks?.length || 0}
                    />
                    <p className={css.progress_title}>Sub-Task</p>
                </button>
            </div>

            <Select className={`${css.col} ${css.col_5}`} closeClickOuside closeClickItem>
                <Select.Button
                    className={clsx(css.label, css.select_button, getColor(selectedColumn))}
                >
                    {getColumnName(selectedColumn)}
                </Select.Button>

                <Select.List className={css.select_list}>
                    {(data.columns || []).map((column) => (
                        <Select.Item
                            className={clsx(css.label, css.select_item, getColor(column.column_id))}
                            onClick={() => handleColumnChange(column.column_id)}
                            key={column.column_id}
                        >
                            {column.name}
                        </Select.Item>
                    ))}
                </Select.List>
            </Select>

            <PopupBox
                active={subtaskState.active}
                onClose={subtaskState.close}
                effect="bottom"
                children={
                    <SubtasksBoardPersonal
                        columns={data?.columns || []}
                        taskData={data}
                        projectId={data.project_id}
                    />
                }
            />

            <PopupBox
                active={assigneesState.active}
                onClose={assigneesState.close}
                effect="side"
                children={<Assignees taskData={data} />}
            />
        </div>
    );
};
