import React, { useState } from 'react';
import { SidebarControls } from './ui/sidebar-controls';
import { SidebarDaos } from './ui/sidebar-daos';
import clsx from 'clsx';
import { useClickOutside } from 'hooks/useClickOutside';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import css from './sidebar.module.scss';
import { useTypedSelector } from 'hooks/useStore';
import { selectActiveDao } from 'store/features/common/slice';
import { useNavigate } from 'react-router-dom';
import { getMemberId } from 'utils/utils';

interface SidebarProps {
    hideDao?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ hideDao }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const sidebarRef = useClickOutside<HTMLElement>(() => setIsExpanded(false));
    const activeDao = useTypedSelector(selectActiveDao);
    const navigate = useNavigate();

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
                        onClick={() => {
                            if (activeDao) {
                                navigate(`/${activeDao}/dashboard/1`);
                            } else {
                                navigate(`/${getMemberId()}/profile`);
                            }
                        }}
                        disabled={hideDao}
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

                {!hideDao && (
                    <SidebarDaos
                        className={css.sidebar_daos}
                        extended={isExpanded}
                        onShrinkMenu={() => setIsExpanded(false)}
                    />
                )}

                <SidebarControls
                    noSettings={hideDao}
                    extended={isExpanded}
                    onShrinkMenu={() => setIsExpanded(false)}
                />
            </div>
        </aside>
    );
};

export default Sidebar;
