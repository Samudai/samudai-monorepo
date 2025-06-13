import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { TabNavigationButtonProps } from '../types';

const TabNavigationButton: React.FC<TabNavigationButtonProps> = ({
    active,
    children,
    contentSize,
    onClick,
    className,
    onSetBackgroundWidth,
}) => {
    const ref = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const button = ref.current;
        if (active && button) {
            const width = button.offsetWidth + 'px';
            const left = button.offsetLeft + 'px';
            if (onSetBackgroundWidth) {
                onSetBackgroundWidth({ width, left });
            }
        }
    }, [active, contentSize]);

    return (
        <li
            ref={ref}
            className={clsx('tab-nav-btn', { active }, className)}
            onClick={onClick}
            data-role="button"
        >
            {children}
        </li>
    );
};

export default TabNavigationButton;
