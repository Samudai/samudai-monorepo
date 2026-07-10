import { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import DetailIcon from 'ui/SVG/DotsIcon';
import Item from './SettingsDropdownItem';
import './SettingsDropdown.scss';

interface SettingsDropdownProps {
    className?: string;
    children?: React.ReactNode;
    button?: JSX.Element;
    onToggle?: (isActive: boolean) => void;
}

const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
    button,
    className,
    children,
    onToggle,
}) => {
    const [active, setActive] = useState<boolean>(false);
    const selectRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const onClickOutsideSelect = (e: MouseEvent) => {
        const selectEl = selectRef.current;
        const buttonEl = buttonRef.current;
        if (
            selectEl &&
            !e.composedPath().includes(selectEl) &&
            buttonEl &&
            !e.composedPath().includes(buttonEl)
        ) {
            setActive(false);
            onToggle?.(false);
        }
    };

    const onClickButton = () => {
        setActive(!active);
        onToggle?.(!active);
    };

    useEffect(() => {
        if (selectRef.current) {
            document.addEventListener('click', onClickOutsideSelect, true);
        }
    });

    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.addEventListener('click', function () {
                setActive(!active);
            });
        }
    });

    return (
        <div
            className={clsx('settings-dropdown', { '--dots': !button }, className)}
            style={{ cursor: 'pointer' }}
        >
            <button
                className="settings-dropdown__button"
                data-role="button"
                onClick={onClickButton}
                ref={buttonRef}
                type="button"
                data-analytics-click="settings_dropdown_button"
            >
                {button || <DetailIcon type="vertical" />}
            </button>
            <CSSTransition
                classNames="settings-dropdown"
                in={active}
                timeout={150}
                unmountOnExit
                mountOnEnter
            >
                <div className="settings-dropdown__select" ref={selectRef} data-role="select">
                    <div className="settings-dropdown__select-container" data-role="select-box">
                        {children}
                    </div>
                </div>
            </CSSTransition>
        </div>
    );
};

export default Object.assign(SettingsDropdown, { Item });
