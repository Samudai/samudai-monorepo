import React, { useState } from 'react';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import MarkIcon from 'ui/SVG/MarkIcon';
import PenIcon from 'ui/SVG/PenIcon';
import TrashIcon from 'ui/SVG/TrashIcon';
import { IView } from 'utils/types/DAO';
import css from './header-view-item.module.scss';

interface HeaderViewItemProps {
    active: boolean;
    view: IView;
    canEdit: boolean;
    onSubmit: (value: string) => void;
    onChangeView: (id: string) => void;
}

export const HeaderViewItem: React.FC<HeaderViewItemProps> = ({
    active,
    canEdit,
    view,
    onSubmit,
    onChangeView,
}) => {
    const [inputValue, setInputValue] = useState(view.name);
    const [isEdit, setIsEdit] = useState(false);

    const handleSubmit = () => {
        const newValue = inputValue.trim();
        if (newValue === '') {
            setInputValue(view.name);
        }
        if (newValue !== view.name) {
            onSubmit(inputValue);
        }
        setIsEdit(false);
    };

    const mainRef = useClickOutside<HTMLDivElement>(handleSubmit);

    const handleChangeView = () => {
        if (!active) {
            onChangeView(view.id);
        }
    };

    return (
        <div
            ref={mainRef}
            className={clsx(css.view, active && css.viewActive, canEdit && css.viewEditable)}
        >
            {!isEdit && (
                <p className={css.view_value} onClick={handleChangeView}>
                    {inputValue}
                </p>
            )}
            {isEdit && (
                <input
                    className={css.view_input}
                    value={inputValue}
                    onChange={(ev) => setInputValue(ev.target.value)}
                    placeholder="View name"
                />
            )}
            {canEdit && (
                <div className={css.view_controls}>
                    {!isEdit && (
                        <>
                            <button
                                className={css.view_controls_btn}
                                onClick={() => setIsEdit(true)}
                                data-analytics-click="header_nav_dashboard_view_edit"
                            >
                                <PenIcon />
                            </button>
                            <button
                                className={css.view_controls_btn}
                                data-analytics-click="header_nav_dashboard_view_delete"
                            >
                                <TrashIcon />
                            </button>
                        </>
                    )}
                    {isEdit && (
                        <button
                            className={clsx(css.view_controls_btn, css.view_controls_btnMark)}
                            onClick={handleSubmit}
                            disabled={inputValue.trim() === ''}
                            data-analytics-click="header_nav_dashboard_view_complete_edit"
                        >
                            <MarkIcon />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
