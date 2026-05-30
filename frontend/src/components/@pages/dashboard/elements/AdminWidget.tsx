import React from 'react';
import { CSSTransition } from 'react-transition-group';
import AdminDraggable from './AdminDraggable/AdminDraggable';
import { getWidgetComponent } from 'data/view/utils';
import { AdminDraggableExtraProps } from 'components/@pages/dashboard/elements/AdminDraggable/types';
import { IWidget } from 'utils/types/DAO';

type AdminWidgetProps = AdminDraggableExtraProps & {
    widget: IWidget;
};

const AdminWidget: React.FC<AdminWidgetProps> = ({
    widget,
    currentWidget,
    isDraggable,
    setDraggable,
    setCurrentWidget,
    onDrop,
}) => {
    const Widget = getWidgetComponent(widget.id);

    return Widget ? (
        <CSSTransition
            in={widget.active}
            timeout={350}
            classNames="widget"
            unmountOnExit
            mountOnEnter
        >
            <AdminDraggable
                widget={widget}
                currentWidget={currentWidget}
                setCurrentWidget={setCurrentWidget}
                isDraggable={isDraggable}
                setDraggable={setDraggable}
                onDrop={onDrop}
            >
                <Widget />
            </AdminDraggable>
        </CSSTransition>
    ) : null;
};

export default AdminWidget;
