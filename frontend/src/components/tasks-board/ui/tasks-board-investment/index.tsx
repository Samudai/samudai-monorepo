import { useMemo } from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Task as ITask, ProjectColumn, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useHorizontalScroll } from 'hooks/useHorizontalScroll';
import { useScrollbar } from 'hooks/useScrollbar';
import { groupByStatus } from 'components/@pages/projects/lib';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import { WithSubtasks } from 'components/tasks-board/providers/withSubtasks';
import { Board } from '../board';
import { Head } from '../head';
import css from '../tasks-board/tasks-board.module.scss';
import ViewForm from 'components/@popups/CreateForm/ViewForm';
import usePopup from 'hooks/usePopup';
import { TaskInvestment } from '../task-investment';

interface TasksBoardInvestmentProps {
    className?: string;
    items: ITask[];
    columns: ProjectColumn[];
    project: ProjectResponse;
    onUpdate: (task: ITask, dropResult: DropResult) => void;
}

function TasksBoardInvestmentWrapper({
    className,
    items,
    columns,
    project,
    onUpdate,
}: TasksBoardInvestmentProps) {
    const { targetRef } = useHorizontalScroll<HTMLDivElement>({
        ignoreElements: '[data-card]',
    });
    const { ref, isScrollbar } = useScrollbar<HTMLDivElement>();

    const taskState = usePopup();

    const renderItems = useMemo(() => {
        return groupByStatus(columns, items);
    }, [items, columns]);

    const handleChange = (groupIndex: number, dropResult: DropResult) => {
        const { source, destination } = dropResult;
        if (!destination) return null;
        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return null;
        }
        let sourceItem: ITask | undefined;
        let destinationCol: ITask[] = [];

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
                    />
                    <div ref={ref} className={`orange-scrollbar ${css.board_container}`}>
                        {renderItems.map((item, index) =>
                            item.data.length > 0 ? (
                                <div className={css.board_box} key={index}>
                                    <Board
                                        className={css.board_board}
                                        data={item.data}
                                        onChange={handleChange.bind(null, index)}
                                        renderElement={(data, shaking) => (
                                            <TaskInvestment
                                                data={data}
                                                handleOpen={taskState.open}
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
                active={taskState.active}
                onClose={taskState.close}
                effect="side"
                children={
                    <ViewForm
                        onClose={taskState.close}
                        form_id={taskState.payload}
                        response_id={taskState.payload}
                    />
                }
            />
        </>
    );
}

export function TasksBoardInvestment(props: TasksBoardInvestmentProps) {
    return (
        <WithSubtasks>
            <TasksBoardInvestmentWrapper {...props} />
        </WithSubtasks>
    );
}
