import React, { useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import styles from './Tooltip.module.scss';

export enum Position {
    TOP = 'top',
    BOTTOM = 'bottom',
    LEFT = 'left',
    RIGHT = 'right',
}

interface TooltipProps {
    position?: Position;
    active?: boolean;
    content: string;
    children: React.ReactNode;
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
    position = Position.BOTTOM,
    active = true,
    content,
    children,
    className,
}) => {
    const [tooltipShow, setTooltipShow] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

    const ref = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);

    const handleMouseEnter = () => {
        const element = childrenRef.current;
        if (element && active) {
            const coords = element.getBoundingClientRect();

            const getStyle = () => {
                switch (position) {
                    case Position.BOTTOM:
                        return {
                            y: coords.top + element.offsetHeight,
                            x: coords.left + element.offsetWidth / 2,
                        };
                    case Position.TOP:
                        return {
                            y: coords.top,
                            x: coords.left + element.offsetWidth / 2,
                        };
                    case Position.LEFT:
                        return {
                            y: coords.top + element.offsetHeight / 2,
                            x: coords.left,
                        };
                    case Position.RIGHT:
                        return {
                            y: coords.top + element.offsetHeight / 2,
                            x: coords.left + element.offsetWidth,
                        };
                }
            };

            setTooltipPos(getStyle());
            setTooltipShow(true);
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (childrenRef.current) {
            const coords = childrenRef.current.getBoundingClientRect();

            if (e.clientX > coords.right || e.clientY > coords.bottom) {
                setTooltipShow(false);
            }
        }
    };

    const handleMouseLeave = () => {
        setTooltipShow(false);
    };

    useEffect(() => {
        const element = ref.current;

        if (element) {
            const coords = element.getBoundingClientRect();
            const offset = 2;

            const getStyle = () => {
                switch (position) {
                    case Position.BOTTOM:
                        return {
                            top: tooltipPos.y + offset + 'px',
                            left: tooltipPos.x - coords.width / 2 + 'px',
                        };
                    case Position.TOP:
                        return {
                            top: tooltipPos.y - coords.height - offset + 'px',
                            left: tooltipPos.x - coords.width / 2 + 'px',
                        };
                    case Position.LEFT:
                        return {
                            top: tooltipPos.y - coords.height / 2 + 'px',
                            left: tooltipPos.x - coords.width - offset + 'px',
                        };
                    case Position.RIGHT:
                        return {
                            top: tooltipPos.y - coords.height / 2 + 'px',
                            left: tooltipPos.x + offset + 'px',
                        };
                }
            };

            Object.assign(element.style, getStyle());
        }
    }, [tooltipPos]);

    return (
        <>
            <div
                ref={childrenRef}
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className={className}
            >
                {children}
            </div>
            <CSSTransition
                in={tooltipShow}
                timeout={200}
                classNames="mc-tooltip"
                unmountOnExit
                mountOnEnter
            >
                <div className={styles.root} ref={ref}>
                    {/* <div className={styles.icon}>
                <img src="/img/icons/user-laptop.png" alt="icon" />
                </div> */}
                    <div className={styles.content}>{content}</div>
                </div>
            </CSSTransition>
        </>
    );
};

export default Tooltip;
