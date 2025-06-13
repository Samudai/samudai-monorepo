import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { getSettingRoutes } from '../utils/routes';
import clsx from 'clsx';
import css from './settings-tabs.module.scss';
import { getMemberId } from 'utils/utils';

interface SettingsTabsProps {}

export const SettingsTabs: React.FC<SettingsTabsProps> = () => {
    const { daoid } = useParams();
    const [activeAnchor, setActiveAnchor] = useState('');
    const memberId = getMemberId();
    const loc = useLocation();

    const route = useMemo(() => {
        const router = getSettingRoutes(daoid!, memberId);

        const routes = router.find((r) => loc.pathname.startsWith(r.baseURL));
        if (!routes) return null;
        const routeData = Object.values(routes.links).find(
            (r) => loc.pathname.replace(/#\.+/, '') === routes.baseURL + r.path
        );
        if (!routeData) return null;

        return {
            routes,
            routeData,
        };
    }, [daoid, loc]);

    const scrollActiveAnchor = () => {
        let active = '';

        for (const anchor of route?.routeData.anchors || []) {
            const element = document.getElementById(anchor.hash.slice(1));

            if (!active) active = anchor.hash;

            if (!element) continue;

            const elementBottom = element.getBoundingClientRect().bottom;

            if (elementBottom <= window.innerHeight && elementBottom > 0) {
                active = anchor.hash;
            }
        }
        if (active !== activeAnchor) {
            setActiveAnchor(active);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', scrollActiveAnchor);
        return () => window.removeEventListener('scroll', scrollActiveAnchor);
    });

    useEffect(() => {
        scrollActiveAnchor();
    }, [route]);

    if (!route) return null;

    const { routeData, routes } = route;

    return (
        <div className={css.root}>
            {Object.entries(routes.links).map(([name, route]) => (
                <div className={css.item} key={name}>
                    <NavLink
                        to={routes.baseURL + route.path}
                        className={css.item_tab}
                        end
                        data-analytics-click={name}
                    >
                        <span>{name}</span>
                    </NavLink>
                    {routeData.anchors.length > 0 && routeData.path === route.path && (
                        <div className={css.anchors}>
                            {routeData.anchors.map((anch) => {
                                const anchorLink = routes.baseURL + route.path + anch.hash;

                                return (
                                    <a
                                        href={anchorLink}
                                        className={clsx(
                                            css.anchors_item,
                                            anch.hash === activeAnchor && css.anchors_itemActive
                                        )}
                                        key={anch.hash}
                                    >
                                        <span>{anch.name}</span>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
