import React, { useCallback } from 'react';
import { BreadcrumbsItem } from './ui/breadcrumbs-item';
import css from './breadcrumbs.module.scss';

export type BreadcrumbsItem = {
    name: string;
    href?: string;
    disabled?: boolean;
};

interface BreadcrumbsProps {
    className?: string;
    links: BreadcrumbsItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ className, links }) => {
    const isCurrentLink = useCallback((linkId: number) => links.length - 1 === linkId, [links]);

    return (
        <div className={className}>
            <div className={css.breadcrumbs}>
                {links.map((link, id) => (
                    <BreadcrumbsItem
                        name={link.name}
                        href={link.href}
                        disabled={link.disabled}
                        current={isCurrentLink(id)}
                        key={link.name}
                    />
                ))}
            </div>
        </div>
    );
};

export default Breadcrumbs;
