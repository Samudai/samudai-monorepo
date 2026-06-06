import React from 'react';
import { NavLink, NavLinkProps } from 'react-router-dom';
import clsx from 'clsx';

type RouteLinkProps = NavLinkProps &
    React.RefAttributes<HTMLAnchorElement> & {
        to: string;
        icon: React.ReactNode;
        title: string;
        children?: React.ReactNode;
        amount?: string | number;
        className?: string;
        amountSmall?: boolean;
        refValue?: React.RefObject<HTMLAnchorElement>;
    };

const RouteLink: React.FC<RouteLinkProps> = ({
    to,
    icon,
    title,
    amount,
    children,
    className,
    amountSmall,
    refValue,
    ...props
}) => {
    const rootClasses = clsx('sidebar-overview__link', className);
    const amountClasses = clsx('sidebar-overview__link-amount', {
        'sidebar-overview__link-amount_small': amountSmall,
    });

    return (
        <NavLink {...props} to={to} className={rootClasses} ref={refValue}>
            {icon}
            <span className="sidebar-overview__link-text">{title}</span>
            {typeof amount === 'string' ||
                (typeof amount === 'number' && <strong className={amountClasses}>{amount}</strong>)}
            {children}
        </NavLink>
    );
};

export default RouteLink;
