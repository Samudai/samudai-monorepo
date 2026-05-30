import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getProfileNav } from './lib/getHeaderNav';
import { HeaderNav } from './ui/header-nav';
import { HeaderSearch } from './ui/header-search';
import clsx from 'clsx';
import { openLoginModal, selectActiveDao, selectMember } from 'store/features/common/slice';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import SidebarIcons from 'ui/SVG/sidebar';
import { getActiveNav, getHeaderNav } from './lib';
import css from './header.module.scss';
import NotificationIcon from 'ui/SVG/Notification';
import { SignIn } from './ui/header-user/signin';

const nav = getHeaderNav();
const profileNav = getProfileNav();

const Header: React.FC = () => {
    const { daoid } = useParams();

    const activeDao = useTypedSelector(selectActiveDao);
    const accountData = useTypedSelector(selectMember);
    const location = useLocation();
    const [activeLink, setActiveLink] = useState(
        getActiveNav(location.pathname, {
            daoId: activeDao,
            accountId: accountData?.data?.member_id,
            currentDaoId: daoid,
        })
    );
    const [currLink, setCurrLink] = useState(
        getActiveNav(location.pathname, {
            daoId: activeDao,
            accountId: accountData?.data?.member_id,
            currentDaoId: daoid,
        })
    );

    const dispatch = useTypedDispatch();

    return (
        <header
            className={clsx(css.header, currLink.groupName === '' && css.headerNone)}
            onMouseLeave={() => setCurrLink(activeLink)}
            data-analytics-parent="header"
        >
            <div className="container">
                <div className={css.header_content}>
                    <nav className={css.header_nav}>
                        {nav
                            .filter((item) => item.name !== 'Settings')
                            .map((item) => (
                                <button
                                    onClick={() => dispatch(openLoginModal({ open: true }))}
                                    data-analytics-click={`header_item_${item.name}`}
                                    className={clsx(
                                        css.header_nav_item,
                                        currLink.groupName === item.name &&
                                            css.header_nav_itemActive
                                    )}
                                    key={item.name}
                                    onMouseEnter={() =>
                                        setCurrLink({
                                            groupName: item.name,
                                            links: item.sublinks.slice(),
                                        })
                                    }
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </button>
                            ))}
                    </nav>

                    <button
                        className={css.header_feedBtn}
                        onClick={() => dispatch(openLoginModal({ open: true }))}
                        data-analytics-click={`header_item_feed`}
                    >
                        <span>Feed</span>
                        <img src="/img/icons/stars.png" alt="✦" />
                    </button>

                    <HeaderSearch isPublic className={css.header_search} />

                    <div className={css.header_controls}>
                        <button
                            className={css.header_controls_btn}
                            onClick={() => dispatch(openLoginModal({ open: true }))}
                        >
                            <NotificationIcon />
                        </button>
                        <button
                            className={css.header_controls_btn}
                            onClick={() => dispatch(openLoginModal({ open: true }))}
                        >
                            <SidebarIcons.Sms />
                        </button>
                    </div>

                    <div
                        className={css.header_user}
                        onClick={() => dispatch(openLoginModal({ open: true }))}
                    >
                        <SignIn />
                    </div>
                </div>
            </div>
            <HeaderNav
                daoId={activeDao}
                currLink={currLink}
                accountId={accountData?.data?.member_id || ''}
                links={currLink.links}
                isPublic
            />
        </header>
    );
};

export default Header;
