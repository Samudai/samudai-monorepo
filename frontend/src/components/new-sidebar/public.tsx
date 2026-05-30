import React, { useState } from 'react';
import { SidebarControls } from './ui/sidebar-controls';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import css from './sidebar.module.scss';
import css2 from './ui/sidebar-daos/sidebar-daos.module.scss';
import PlusIcon from 'ui/SVG/PlusIcon';
import { useTypedDispatch } from 'hooks/useStore';
import { openLoginModal } from 'store/features/common/slice';

const Sidebar: React.FC = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const sidebarRef = useClickOutside<HTMLElement>(() => setIsExpanded(false));
    const dispatch = useTypedDispatch();

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    return (
        <aside
            className={clsx(css.sidebar, isExpanded && css.sidebarExpanded)}
            ref={sidebarRef}
            data-analytics-parent="sidebar"
        >
            <div className={css.sidebar_box}>
                <header className={css.sidebar_head} data-analytics-parent="sidebar_header">
                    <button
                        className={css.sidebar_logoBtn}
                        onClick={() => dispatch(openLoginModal({ open: true }))}
                        data-analytics-click="samudai_button"
                    >
                        <img src={require('images/logo.png')} alt="logo" />
                    </button>
                    <button
                        className={css.sidebar_menuCloseBtn}
                        onClick={toggleSidebar}
                        data-analytics-click="toggle_sidebar"
                    >
                        <ArrowLeftIcon />
                    </button>
                </header>

                <button
                    className={css.sidebar_menuBtn}
                    onClick={toggleSidebar}
                    data-analytics-click="sidebar_menu"
                >
                    <span className={css.sidebar_menuBtn_inner}>
                        <span />
                    </span>
                </button>

                <div
                    className={clsx(css2.daos, isExpanded && css2.daosExtended)}
                    style={{ marginTop: '15px' }}
                >
                    <button
                        className={clsx(css2.daos_item, css2.daos_itemAdd)}
                        onClick={() => dispatch(openLoginModal({ open: true }))}
                        data-analytics-click="add_dao_button"
                    >
                        <span className={css2.daos_addBtn}>
                            <PlusIcon />
                        </span>
                    </button>
                </div>

                <SidebarControls
                    extended={isExpanded}
                    noSettings
                    onShrinkMenu={() => setIsExpanded(false)}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
