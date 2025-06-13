import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import css from './task-accordeon.module.scss';

interface TaskAccordeonProps {
    button: React.ReactElement;
    children: React.ReactNode;
    disabled?: boolean;
}

export const TaskAccordeon: React.FC<TaskAccordeonProps> = ({ button, children, disabled }) => {
    const [active, setActive] = useState(true);
    const contentRef = useRef<HTMLDivElement>(null);

    const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const target = ev.target as HTMLDivElement;
        if (target.closest('button')) return;
        setActive(!active);
    };

    const isEmpty = !button.props.children;

    useEffect(() => {
        if (contentRef.current && !disabled) {
            contentRef.current.style.height = active
                ? contentRef.current.scrollHeight + 'px'
                : '0px';
        }
    }, [active, disabled]);

    return (
        <div className={clsx(css.root, disabled && css.rootDisabled, active && css.rootActive)}>
            {!isEmpty && (
                <div className={css.button} onClick={onClick}>
                    {button}
                </div>
            )}

            <div className={css.content} ref={contentRef}>
                {children}
            </div>
        </div>
    );
};
