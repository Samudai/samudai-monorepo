import React, { useMemo } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import {
    ProjectColumn,
    SubTask,
    SubTaskResponse,
    TaskResponse,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';
import { useScrollbar } from 'hooks/useScrollbar';
import { groupByStatus } from 'components/@pages/projects/lib';
import { ProjectsSubtasksDetails } from 'components/@pages/projects/ui/projects-subtasks-details';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { useSubtaskState } from 'components/tasks-board/providers/withSubtasks';
import { Board } from '../board';
import { Creator } from '../creator';
import { Head } from '../head';
import { Subtask } from '../subtask';
import css from '../subtasks-board/subtasks-board.module.scss';
import { useSubTasks } from 'components/tasks-board/lib/hooks/use-subTasks';
import { getMemberId } from 'utils/utils';
import { createSubTaskRequest } from 'store/services/projects/model';

interface SubtasksBoardPersonalProps {
    columns: ProjectColumn[];
    taskData: TaskResponse;
    projectId: string;
}

export const SubtasksBoardPersonal: React.FC<SubtasksBoardPersonalProps> = ({
    columns,
    taskData,
    projectId,
}) => {
    const { subTasks, createSubTask, updateSubTask, setSubTasks } = useSubTasks(
        taskData.task_id!,
        projectId
    );
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();
    const { subtaskDetailState } = useSubtaskState();
    const { targetRef } = useHorizontalScroll<HTMLDivElement>({
        ignoreElements: '[data-card]',
    });
    const memberId = getMemberId();

    const getRequiredFields = (subTasks: SubTask[]) => {
        return subTasks.map((subtask) => {
            return {
                ...subtask,
                subtask_id: subtask.subtask_id,
                title: subtask.title,
                col: subtask.col,
                position: subtask.position,
                task_id: '',
            };
        });
    };

    const renderItems = useMemo(
        () => groupByStatus(columns, getRequiredFields(subTasks)),
        [columns, subTasks]
    );

    const handleChange = (groupIndex: number, dropResult: DropResult) => {
        const { source, destination } = dropResult;
        if (!destination) return null;
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return null;
        }

        let sourceItem: SubTask | undefined;
        let destinationCol: SubTask[] = [];

        for (let i = 0; i < renderItems.length; i++) {
            const { data } = renderItems[i];

            if (i !== groupIndex) continue;

            for (const col of data) {
                if (col.column.column_id.toString() === destination.droppableId) {
                    destinationCol = col.items;
                }
                if (col.column.column_id.toString() === source.droppableId) {
                    sourceItem = col.items.find((_, id) => id === source.index);
                }
            }
        }

        if (!sourceItem || !destinationCol) return;

        const prevItem = destinationCol[destination.index - 1];
        const nextItem = destinationCol[destination.index];

        let position = sourceItem.position;

        if (prevItem && nextItem) {
            position = (prevItem.position + nextItem.position) / 2;
        } else if (prevItem) {
            position = prevItem.position + 65536;
        } else if (nextItem) {
            position = nextItem.position / 2;
        }

        updateSubTask(
            {
                ...sourceItem,
                position,
                col: +destination.droppableId,
            },
            dropResult
        );
    };

    const handleCreateSubTask = (title: string, columnId: number) => {
        const currSubTasks = subTasks
            .filter((subtask) => subtask.col === columnId)
            .sort((subtask1, subtask2) => subtask1.position - subtask2.position);

        const oldSubtasks = [...subTasks];

        localStorage.setItem('_taskid', taskData.task_id!);
        localStorage.setItem('_projectid', projectId!);

        const payload: createSubTaskRequest = {
            subtask: {
                project_id: projectId!,
                task_id: taskData.task_id!,
                title: title,
                created_by: memberId as string,
                poc_member_id: memberId as string,
                col: columnId,
                position: currSubTasks.length
                    ? currSubTasks[currSubTasks.length - 1].position + 65536
                    : 65536,
            },
        };

        setSubTasks([...subTasks, payload.subtask as SubTaskResponse]);

        return createSubTask(payload)
            .catch(() => setSubTasks(oldSubtasks))
            .finally(() => {
                localStorage.removeItem('_taskid');
                localStorage.removeItem('_projectid');
            });
    };

    return (
        <>
            <Popup className={css.board}>
                <div className="container">
                    <div
                        ref={targetRef}
                        className={clsx(
                            'orange-scrollbar',
                            css.board_wrapper,
                            isScrollbar && css.board_wrapperScrollbar
                        )}
                    >
                        <Head data={renderItems[0]?.data} project_id={projectId} />
                        <div ref={ref} className={`orange-scrollbar ${css.board_container}`}>
                            {renderItems.map((item, index) =>
                                item.data.length > 0 ? (
                                    <div className={css.board_box} key={index}>
                                        <Board
                                            data={item.data}
                                            onChange={handleChange.bind(null, index)}
                                            renderElement={(item) => (
                                                <Subtask data={item} personal />
                                            )}
                                            renderCreator={(columnId) => (
                                                <Creator
                                                    columnId={columnId}
                                                    onSubmit={handleCreateSubTask}
                                                />
                                            )}
                                        />
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>
            </Popup>
            <PopupBox
                active={subtaskDetailState.active}
                onClose={subtaskDetailState.close}
                effect="side"
                enableScrollOnActive
                children={
                    <ProjectsSubtasksDetails data={subtaskDetailState.payload!} access personal />
                }
            />
        </>
    );
};
