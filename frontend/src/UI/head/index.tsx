import React from 'react';
import clsx from 'clsx';
import Breadcrumbs, { BreadcrumbsItem } from 'components/breadcrumbs';
import css from './head.module.scss';

interface HeadProps {
    className?: string;
    classNameRoot?: string;
    breadcrumbs?: BreadcrumbsItem[];
    breadcrumbsComp?: React.ReactNode;
    children?: React.ReactNode;
    dataParentId?: string;
}

const Title: React.FC<{
    title: string;
    className?: string;
    style?: React.CSSProperties;
}> = ({ title, className, style }) => (
    <h2 style={style} className={clsx(css.head_title, className)}>
        {title}
    </h2>
);

const Head: React.FC<HeadProps> = ({
    className,
    classNameRoot,
    breadcrumbs,
    breadcrumbsComp,
    children,
    dataParentId,
}) => {
    return (
        <header className={clsx(css.head, classNameRoot)} data-analytics-parent={dataParentId}>
            <div className="container">
                {breadcrumbs && (
                    <div className={css.head_breadcrumbs}>
                        <Breadcrumbs links={breadcrumbs} />
                        {breadcrumbsComp}
                    </div>
                )}
                {children && <div className={clsx(css.head_content, className)}>{children}</div>}
            </div>
        </header>
    );
};

export default Object.assign(Head, { Title });
