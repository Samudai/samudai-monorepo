import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import ArrowLeftIcon from 'ui/SVG/ArrowLeftIcon';
import css from './forum-filter-accordeon.module.scss';

interface ForumFilterAccordeonProps {
    className?: string;
    name: string;
    children: React.ReactNode;
    dataClickId: string;
}

export const ForumFilterAccordeon: React.FC<ForumFilterAccordeonProps> = ({
    children,
    name,
    className,
    dataClickId,
}) => {
    const [active, setActive] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.style.height = `${active ? contentRef.current.scrollHeight : 0}px`;
        }
    }, [active]);

    return (
        <div className={clsx(className, css.accordeon, active && css.accordeonActive)}>
            <button
                className={css.accordeon_button}
                onClick={setActive.bind(null, !active)}
                data-analytics-click={dataClickId}
            >
                <span>{name}</span>
                <ArrowLeftIcon />
            </button>
            <div className={css.accordeon_content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
};
