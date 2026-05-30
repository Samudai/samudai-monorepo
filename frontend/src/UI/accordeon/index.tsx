import clsx from 'clsx';
import React, { useEffect, useRef, useState } from 'react';
import css from './accordeon.module.scss';

type ContentType = React.ReactNode | ((active: boolean) => React.ReactNode);

interface AccordeonProps {
    className?: string;
    classNameActive?: string;
    button: ContentType;
    content: ContentType;
    onClose?: () => void;
}

const Accordeon: React.FC<AccordeonProps> = ({
    className,
    classNameActive,
    button,
    content,
    onClose,
}) => {
    const [active, setActive] = useState(true);
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
        <div className={clsx(className, css.accordeon, active && classNameActive)}>
            <div className={css.accordeon_btn} onClick={toggle}>
                {typeof button === 'function' ? button(active) : button}
            </div>
            <div ref={contentRef} className={css.accordeon_content}>
                {typeof content === 'function' ? content(active) : content}
            </div>
        </div>
    );
};

export default Accordeon;
