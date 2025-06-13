import { useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import { getPopupLayoutWidgets } from 'data/view/utils';
import { selectDaoViewActive, toggleActiveWidget } from 'store/features/dao/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Switch from 'ui/Switch/Switch';
import { PopupShowProps } from '../types';
import './AddWidget.scss';
import CloseButton from 'ui/@buttons/Close/Close';

interface AddWidgetProps extends PopupShowProps {
    className?: string;
}

const AddWidget: React.FC<AddWidgetProps> = ({ className, active, onClose }) => {
    const { id, widgets } = useTypedSelector(selectDaoViewActive);
    const dispatch = useTypedDispatch();

    const toggleWidgetActivity = (widgetId: number) => {
        dispatch(
            toggleActiveWidget({
                viewId: id,
                widgetId,
            })
        );
    };

    const onClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        const isCurrentPopup = target.closest('#addwidget-popup');
        const isOpenButton = target.closest('#addwidget-btn');
        if (!isCurrentPopup && !isOpenButton && active) {
            onClose();
        }
    };

    useEffect(() => {
        if (!active) return;
        window.addEventListener('click', onClickOutside);
        return () => window.removeEventListener('click', onClickOutside);
    });

    return (
        <CSSTransition timeout={400} in={active} classNames="addwidget" mountOnEnter unmountOnExit>
            <div
                id="addwidget-popup"
                className={clsx('addwidget', className)}
                data-analytics-parent="add_widget_dropdown"
            >
                <CloseButton className="addwidget__close" onClick={onClose} />
                <h3 className="addwidget__title">Add Widget</h3>
                <ul className="addwidget__list">
                    {getPopupLayoutWidgets(widgets).map((widget) => (
                        <li
                            className={clsx('addwidget__item', { inactive: !widget.active })}
                            key={widget.name}
                        >
                            <button
                                className="addwidget__btn"
                                type="button"
                                onClick={() => toggleWidgetActivity(widget.id)}
                                data-analytics-click={widget.name + '_toggle'}
                            >
                                <span>{widget.name}</span>
                                <Switch component="div" active={widget.active} />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </CSSTransition>
    );
};

export default AddWidget;
