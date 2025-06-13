import { useEffect, useMemo, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { SubtasksBoardPersonal } from '../subtasks-board-personal';
import {
    Task as ITask,
    ProjectColumn,
    ProjectResponse,
    TaskResponse,
} from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';
import { useScrollbar } from 'hooks/useScrollbar';
import { groupByStatus } from 'components/@pages/projects/lib';
import { ProjectsTaskDetails } from 'components/@pages/projects/ui/projects-task-cr';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { useCreateTask } from 'components/tasks-board/lib/hooks';
import { WithSubtasks, useSubtaskState } from 'components/tasks-board/providers/withSubtasks';
import { Board } from '../board';
import { Creator } from '../creator';
import { Head } from '../head';
import { Task } from '../task';
import css from '../tasks-board/tasks-board.module.scss';
import { getMemberId } from 'utils/utils';
import { createTaskRequest } from 'store/services/projects/model';

interface TasksBoardPersonalProps {
    className?: string;
    items: TaskResponse[];
    columns: ProjectColumn[];
    project: ProjectResponse;
    onUpdate: (task: ITask, dropResult: DropResult) => void;
}

function TasksBoardPersonalWrapper({
    className,
    items,
    columns,
    project,
    onUpdate,
}: TasksBoardPersonalProps) {
    const [taskData, setTaskData] = useState(items);

    const { subtaskState, detailState } = useSubtaskState();
    const { targetRef } = useHorizontalScroll<HTMLDivElement>({
        ignoreElements: '[data-card]',
    });
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();
    const { onSubmit } = useCreateTask();
    const memberId = getMemberId();

    const renderItems = useMemo(() => {
        return groupByStatus(columns, taskData);
    }, [taskData, columns]);

    const handleChange = (groupIndex: number, dropResult: DropResult) => {
        const { source, destination } = dropResult;
        if (!destination) return null;
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return null;
        }

        let sourceItem: TaskResponse | undefined;
        let destinationCol: TaskResponse[] = [];

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

        onUpdate(
            {
                ...sourceItem,
                position,
                col: +destination.droppableId,
            },
            dropResult
        );
    };

    const handleCreateTask = (title: string, columnId: number) => {
        const currTasks = taskData
            .filter((task) => task.col === columnId)
            .sort((task1, task2) => task1.position - task2.position);

        const oldTasks = [...taskData];

        const newTask: createTaskRequest = {
            task: {
                project_id: project.project_id!,
                title: title,
                created_by: memberId as string,
                poc_member_id: memberId as string,
                col: columnId,
                position: currTasks.length
                    ? currTasks[currTasks.length - 1].position + 65536
                    : 65536,
            },
        };

        setTaskData([...taskData, newTask.task as TaskResponse]);

        return onSubmit(newTask, project).catch(() => setTaskData(oldTasks));
    };

    useEffect(() => {
        items.length && setTaskData(items);
    }, [items]);

    return (
        <>
            <div className={clsx(css.board, className)}>
                <div
                    ref={targetRef}
                    className={clsx(
                        'orange-scrollbar',
                        css.board_wrapper,
                        isScrollbar && css.board_wrapperScrollbar
                    )}
                >
                    <Head
                        data={
                            renderItems[0]?.data || columns.map((column) => ({ column, items: [] }))
                        }
                        menu
                        project_id={project.project_id}
                    />
                    <div ref={ref} className={`orange-scrollbar ${css.board_container}`}>
                        {renderItems.map((item, index) =>
                            item.data.length > 0 ? (
                                <div className={css.board_box} key={index}>
                                    <Board
                                        data={item.data}
                                        onChange={handleChange.bind(null, index)}
                                        renderElement={(data, shaking) => (
                                            <Task
                                                data={data}
                                                shaking={null}
                                                cancelShaking={() => {}}
                                                fields={['department', 'person']}
                                                personal
                                            />
                                        )}
                                        renderCreator={(columnId) => (
                                            <Creator
                                                columnId={columnId}
                                                onSubmit={handleCreateTask}
                                            />
                                        )}
                                    />
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
            <PopupBox
                active={subtaskState.active}
                onClose={subtaskState.close}
                effect="bottom"
                children={
                    <SubtasksBoardPersonal
                        columns={columns}
                        taskData={subtaskState.payload}
                        projectId={project.project_id!}
                    />
                }
            />
            <PopupBox
                active={detailState.active}
                onClose={detailState.close}
                effect="side"
                children={
                    <ProjectsTaskDetails
                        project={project}
                        data={detailState.payload!}
                        columns={columns}
                        onClose={detailState.close}
                        access
                        personal
                    />
                }
            />
        </>
    );
}

export function TasksBoardPersonal(props: TasksBoardPersonalProps) {
    return (
        <WithSubtasks>
            <TasksBoardPersonalWrapper {...props} />
        </WithSubtasks>
    );
}
