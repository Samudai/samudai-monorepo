import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import styles from './hint.module.scss';

interface HintProps {
    position?: 'left' | 'right' | 'top' | 'bottom';
    text: string | number;
    children?: React.ReactNode;
    maxWidth?: number;
    margin?: number;
    className?: string;
}

const Hint: React.FC<HintProps> = ({
    text,
    position = 'bottom',
    maxWidth = 300,
    margin = 20,
    children,
    className,
}) => {
    const mainRef = useRef<HTMLDivElement>(null);
    const hintRef = useRef<HTMLDivElement>(null);
    const [showHint, setShowHint] = useState(false);

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        const mainElement = mainRef.current;

        if (mainElement) {
            const coords = mainElement.getBoundingClientRect();

            if (
                e.clientX > coords.right ||
                e.clientX < coords.left ||
                e.clientY < coords.top ||
                e.clientY > coords.bottom
            ) {
                return;
            }

            setShowHint(true);
        }
    };

    const handleMouseLeave = () => {
        setShowHint(false);
    };

    useEffect(() => {
        if (showHint) {
            const mainElement = mainRef.current;
            const hintElement = hintRef.current;

            if (mainElement && hintElement) {
                const mainCoords = mainElement.getBoundingClientRect();
                const hintCoords = hintElement.getBoundingClientRect();
                let left = 0;
                let top = 0;

                if (position === 'bottom' || position === 'top') {
                    left = mainCoords.left + mainCoords.width / 2 - hintCoords.width / 2;

                    if (position === 'top') {
                        top = mainCoords.top - (hintCoords.height + margin);
                    } else {
                        top = mainCoords.bottom + margin;
                    }
                }

                if (position === 'left' || position === 'right') {
                    top = mainCoords.top + mainCoords.height / 2 - hintCoords.height / 2;

                    if (position === 'left') {
                        left = mainCoords.left - (hintCoords.width + margin);
                    } else {
                        left = mainCoords.right + margin;
                    }
                }

                Object.assign(hintElement.style, {
                    left: left + 'px',
                    top: top + 'px',
                    maxWidth: maxWidth + 'px',
                });

                setShowHint(true);
            }
        }
    }, [showHint]);

    return (
        <div
            ref={mainRef}
            className={clsx(styles.root, className)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {createPortal(
                <CSSTransition
                    in={showHint}
                    timeout={150}
                    classNames="hint-app"
                    unmountOnExit
                    mountOnEnter
                >
                    <div ref={hintRef} className={clsx(styles.hint, styles[position])}>
                        <p className={styles.text}>{text}</p>
                    </div>
                </CSSTransition>,
                document.getElementById('app')!
            )}
            {children}
        </div>
    );
};

export default Hint;
