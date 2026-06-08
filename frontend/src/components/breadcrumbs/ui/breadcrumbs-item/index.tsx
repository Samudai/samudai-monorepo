import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import css from './breadcrumbs-item.module.scss';

interface BreadcrumbsItemProps {
    name: string;
    current: boolean;
    href?: string;
    disabled?: boolean;
}

export const BreadcrumbsItem: React.FC<BreadcrumbsItemProps> = ({
    name,
    current,
    href,
    disabled = false,
}) => {
    const location = useLocation();
    const linkClasses = (disabled: boolean) =>
        clsx(
            css.breadcrumbs_link,
            disabled && css.breadcrumbs_linkDisabled,
            current && css.breadcrumbs_linkActive
        );

    return (
        <React.Fragment>
            {!href && !current && <div className={linkClasses(true)}>{name}</div>}
            {(href || current) && (
                <NavLink className={linkClasses(disabled)} to={href || location.pathname}>
                    {name}
                </NavLink>
            )}
            {!current && <ArrowLeftIcon className={css.breadcrumbs_arrow} />}
        </React.Fragment>
    );
};
