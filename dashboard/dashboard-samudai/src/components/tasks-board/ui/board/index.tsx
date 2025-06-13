import { DragDropContext, Draggable, Droppable, OnDragEndResponder } from 'react-beautiful-dnd';
import clsx from 'clsx';
import { RequiredFields, SortByStatus } from 'components/@pages/projects/lib';
import css from './board.module.scss';

interface BoardProps<T extends RequiredFields> {
    className?: string;
    data: SortByStatus<T>[];
    onChange: OnDragEndResponder;
    renderElement: (data: T, index: number) => JSX.Element;
    renderCreator?: (columnId: number) => JSX.Element;
}

export function Board<T extends RequiredFields>({
    className,
    data,
    onChange,
    renderElement,
    renderCreator,
}: BoardProps<T>) {
    return (
        <>
            <div className={clsx(css.board, className)}>
                <DragDropContext onDragEnd={onChange}>
                    {data.map((group) => (
                        <Droppable
                            key={group.column.column_id}
                            droppableId={group.column.column_id.toString()}
                        >
                            {(provided, snapshot) => (
                                <div
                                    className={clsx(
                                        css.board_column,
                                        snapshot.isDraggingOver && css.board_columnDragging
                                    )}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    {group.items.map((item, index) => (
                                        <Draggable
                                            key={
                                                item.task_id || item.subtask_id || item.response_id
                                            }
                                            draggableId={
                                                item.task_id ||
                                                item.subtask_id ||
                                                item.response_id ||
                                                index.toString()
                                            }
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    className={css.board_item}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    data-card
                                                >
                                                    {renderElement(item, index)}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                    {renderCreator && (
                                        <div className={css.board_creator}>
                                            {renderCreator(group.column.column_id)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </DragDropContext>
            </div>
        </>
    );
}
