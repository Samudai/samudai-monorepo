import React, { useState } from 'react';
import { NavLink, useMatch } from 'react-router-dom';
import { HeaderViewItem } from '../header-view-item';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import usePopup from 'hooks/usePopup';
import DeleteView from 'components/@popups/DeleteView/DeleteView';
import { useView } from 'components/new-header/lib/hooks';
import Select from 'ui/@form/Select/Select';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import PlusIcon from 'ui/SVG/PlusIcon';
import { IView } from 'utils/types/DAO';
import css from './header-view.module.scss';

interface HeaderViewProps {
    href: string;
    name: string;
}

export const HeaderView: React.FC<HeaderViewProps> = ({ name, href }) => {
    const {
        access,
        viewsLocal,
        daoActiveId,
        handleChangeView,
        handleCreateView,
        buttonDisabled,
        handleSubmitViewValue,
    } = useView();
    const [menuActive, setMenuActive] = useState(false);
    const deleteView = usePopup<IView>();
    const matched = useMatch(href);
    const clickRef = useClickOutside<HTMLDivElement>(() => setMenuActive(false));

    const onShowMenu = () => {
        if (matched) {
            setMenuActive(!menuActive);
        }
    };

    const canEdit = (viewId: string) => {
        return daoActiveId !== viewId && access;
    };

    return (
        <div
            className={css.view}
            ref={clickRef}
            data-analytics-click="header_nav_dashboard"
            id={`header_nav_dashboard`}
        >
            <NavLink
                className={clsx(css.view_btn, menuActive && css.view_btnActive)}
                to={href}
                onClick={onShowMenu}
            >
                <span>{name}</span>
                <ArrowLeftIcon />
            </NavLink>
            <Select.List
                active={menuActive}
                className={css.view_list}
                data-analytics-parent="header_nav_dashboard_view_select"
            >
                {viewsLocal.map((view) => (
                    <Select.Item
                        className={clsx(
                            css.view_item,
                            view.id === daoActiveId && css.view_itemActive
                        )}
                        data-analytics-click="header_nav_dashboard_view_select_item"
                        key={view.id}
                    >
                        <HeaderViewItem
                            view={view}
                            canEdit={canEdit(view.id)}
                            active={view.id === daoActiveId}
                            onSubmit={handleSubmitViewValue.bind(null, view.id)}
                            onChangeView={handleChangeView}
                        />
                        {/* <Radio
                            value={view.id}
                            checked={view.id === daoActiveId}
                            onChange={handleChangeView.bind(null, view.id)}
                        /> */}

                        {/* <TextInput
                            className={css.view_input}
                            classNameAll={css.view_name}
                            value={view.name}
                            onInputChange={(data) => handleChangeViewValue(view.id, data)}
                            onFocus={() => setEditView(view)}
                            onBlur={() => setEditView(editView?.id === view.id ? null : editView)}
                            onSubmit={(data) => handleSubmitViewValue(view.id, data)}
                            onClear={handleClearViewValue}
                            isActive={editView?.id === view.id}
                        />

                        {canChange(view.id) && (
                            <>
                                <button
                                    className={css.view_controlBtn}

                                >

                                </button>
                                <button
                                    className={css.view_controlBtn}
                                    onClick={deleteView.open.bind(null, view)}
                                >
                                    <TrashIcon />
                                </button>
                            </>
                            // <CloseButton
                            //     className={css.view_remove}
                            //     onClick={deleteView.open.bind(null, view)}
                            // />
                        )} */}
                    </Select.Item>
                ))}
                {access && (
                    <Select.After className={css.view_list_after}>
                        <button
                            className={css.view_createBtn}
                            disabled={buttonDisabled}
                            onClick={handleCreateView}
                            data-analytics-click="header_nav_dashboard_view_create"
                        >
                            <PlusIcon />
                            <span>Create</span>
                        </button>
                    </Select.After>
                )}
            </Select.List>
            <DeleteView
                view={deleteView.payload!}
                active={deleteView.active}
                onClose={deleteView.close}
            />
        </div>
    );
};
