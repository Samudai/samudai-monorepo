import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import css from './projects-accordeon.module.scss';

type ContentType = React.ReactNode | ((active: boolean) => React.ReactNode);

interface ProjectsAccordeonProps {
    className?: string;
    classNameActive?: string;
    button: ContentType;
    content: ContentType;
    onClose?: () => void;
    dataAnalyticsId?: string;
    active?: boolean;
}

export const ProjectsAccordeon: React.FC<ProjectsAccordeonProps> = ({
    className,
    classNameActive,
    button,
    content,
    onClose,
    dataAnalyticsId,
    active: isActive,
}) => {
    const [active, setActive] = useState(isActive);
    const contentRef = useRef<HTMLDivElement>(null);

    const toggle = () => {
        if (active) {
            setActive(false);
            onClose?.();
        } else {
            setActive(true);
        }
    };

    useEffect(() => {
        if (!contentRef.current) return;
        const element = contentRef.current;
        element.style.height = active ? 'auto' : '0px';
        element.style.overflow = active ? 'visible' : 'hidden';
    });

    return (
        <div
            className={clsx(className, css.accordeon, active && classNameActive)}
            data-analytics-click={dataAnalyticsId}
        >
            <div className={css.accordeon_btn} onClick={toggle}>
                {typeof button === 'function' ? button(Boolean(active)) : button}
            </div>
            <div ref={contentRef} className={css.accordeon_content}>
                {typeof content === 'function' ? content(Boolean(active)) : content}
            </div>
        </div>
    );
};
