import React, { ReactElement, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import Popup from '../Popup/Popup';
import clsx from 'clsx';
import { toggleScroll } from 'utils/use';
import './PopupBox.scss';

interface PopupBoxProps {
    className?: string;
    popupClassName?: string;
    active: boolean;
    children: React.ReactNode;
    containerId?: string;
    effect?: 'side' | 'filter' | 'default' | 'bottom';
    timeout?: number;
    enableScrollOnActive?: boolean;
    onClose?: () => void;
}

const PopupBox: React.FC<PopupBoxProps> = ({
    active,
    children,
    className,
    popupClassName,
    enableScrollOnActive,
    timeout = 350,
    containerId,
    effect = 'default',
    onClose,
}) => {
    const rendered = useRef<boolean>(false);
    const transitionClassName = effect === 'default' ? 'popup-box' : `popup-${effect}`;

    const handleClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 2 && e.target === e.currentTarget && onClose) {
            onClose();
        }
    };

    const handleScroll = (active: boolean) => {
        if (!enableScrollOnActive) {
            toggleScroll(active);
        }
    };

    useEffect(() => {
        if (rendered.current && active) {
            handleScroll(false);
        }
        rendered.current = true;
    }, [active]);

    useEffect(() => {
        return () => {
            handleScroll(true);
        };
    }, []);

    const Children = (
        <CSSTransition
            classNames={transitionClassName}
            timeout={timeout}
            in={active}
            mountOnEnter
            unmountOnExit
            onExited={handleScroll.bind(null, true)}
        >
            <div className={clsx('popup-box custom-scrollbar', `popup-box-${effect}`, className)}>
                <div
                    className={clsx('popup-box__scrollable', popupClassName || 'popup-box__fade')}
                    onMouseDown={handleClickWrapper}
                    data-popup-scrollable
                >
                    {React.Children.map(children, (child) => {
                        if (React.isValidElement(child)) {
                            if (child.type !== Popup) return child;
                            return React.cloneElement(child as ReactElement<any>, { onClose });
                        }
                        return null;
                    })}
                </div>
            </div>
        </CSSTransition>
    );
    const container = document.getElementById(containerId || 'app');

    return container ? ReactDOM.createPortal(Children, container) : null;
};

export default PopupBox;
