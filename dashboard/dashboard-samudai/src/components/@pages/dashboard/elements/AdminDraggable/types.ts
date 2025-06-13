import { IWidget } from 'utils/types/DAO';

export enum DragClasses {
    over = 'over',
    main = 'admin-draggable',
    block = 'block',
}

export interface AdminDraggableDefaultProps {
    children: React.ReactNode;
    widget: IWidget;
}

export interface AdminDraggableExtraProps {
    isDraggable: boolean;
    currentWidget: IWidget | null;
    setDraggable: (arg: React.SetStateAction<boolean>) => void;
    setCurrentWidget: (arg: React.SetStateAction<IWidget | null>) => void;
    onDrop: (w1: IWidget, w2: IWidget) => void;
}

export type AdminDraggableProps = AdminDraggableDefaultProps & AdminDraggableExtraProps;
