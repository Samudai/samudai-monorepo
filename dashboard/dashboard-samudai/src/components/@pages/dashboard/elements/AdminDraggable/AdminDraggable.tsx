import React from 'react';
import clsx from 'clsx';
import { IWidget } from 'utils/types/DAO';
import { AdminDraggableProps, DragClasses } from './types';
import '../../styles/AdminDraggable.scss';

const AdminDraggable: React.FC<AdminDraggableProps> = ({
    widget,
    children,
    isDraggable,
    currentWidget,
    setDraggable,
    setCurrentWidget,
    onDrop,
}) => {
    const isDragging = isDraggable && widget.draggable;

    const startHandler = (e: React.DragEvent<HTMLDivElement>, widget: IWidget) => {
        setCurrentWidget(widget);
        e.currentTarget.style.opacity = '0.4';
    };

    const overHandler = (e: React.DragEvent<HTMLDivElement>, widget: IWidget) => {
        e.preventDefault();
        if (currentWidget?.id === widget.id) return;

        const target = e.target as HTMLDivElement;
        const closest = target.closest(`.${DragClasses.block}`);
        if (closest) {
            closest.classList.add(DragClasses.over);
        }
    };

    const leaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        target.classList.remove(DragClasses.over);
    };

    const endHandler = (e: React.DragEvent<HTMLDivElement>) => {
        setCurrentWidget(null);
        e.currentTarget.style.opacity = '';
    };

    const dropHandler = (e: React.DragEvent<HTMLDivElement>, widget: IWidget) => {
        e.preventDefault();
        if (currentWidget) {
            onDrop(currentWidget, widget);
        }
    };

    const onClickDragButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        setDraggable(!isDraggable);
    };

    return (
        <div
            className={clsx('admin-draggable', { draggable: isDragging })}
            {...(isDragging && {
                draggable: true,
                onDrag: (e) => startHandler(e, widget),
                onDragOver: (e) => overHandler(e, widget),
                onDragLeave: leaveHandler,
                onDragEnd: endHandler,
                onDrop: (e) => dropHandler(e, widget),
            })}
        >
            {/* <Block.DragButton
        isDraggable={widget.draggable}
        isDraggableActive={isDraggable}
        onClickDrag={onClickDragButton}
      /> */}
            {children}
        </div>
    );
};

export default AdminDraggable;
