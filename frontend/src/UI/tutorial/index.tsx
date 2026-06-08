import React, { useEffect, useRef } from 'react';
import styles from './tutorial.module.scss';
import Popup from './Popup';
import ReactDOM from 'react-dom/client';
import { TutorialStep } from './utils';

interface TutorialProps {
    id: string;
    active: boolean;
    step: TutorialStep;
    totalSteps: number;
    position: 'bottom-left' | 'bottom-right' | 'right-top';
    nextStep?: () => void;
    onSkip?: () => void;
    onClose: () => void;
}

const Tutorial: React.FC<TutorialProps> = ({
    id,
    active,
    step,
    totalSteps,
    position,
    onSkip,
    nextStep,
    onClose,
}) => {
    const popupRef = useRef<HTMLDivElement | null>(null);
    const highlightBoxRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                active &&
                popupRef.current &&
                highlightBoxRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                !highlightBoxRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        const elementToHighlight = document.getElementById(id);

        if (elementToHighlight) {
            const elementRect = elementToHighlight.getBoundingClientRect();

            if (active) {
                const container = document.createElement('div');
                container.className = styles.container;
                document.body.appendChild(container);

                const overlay = document.createElement('div');
                overlay.className = styles.overlay;
                document.body.appendChild(overlay);

                const highlightBox = document.createElement('div');
                highlightBox.className = styles.highlightBox;
                highlightBox.style.width = `${elementRect.width}px`;
                highlightBox.style.height = `${elementRect.height}px`;
                highlightBox.style.top = `${elementRect.top}px`;
                highlightBox.style.left = `${elementRect.left}px`;

                overlay.appendChild(highlightBox);

                highlightBoxRef.current = highlightBox;

                const root = ReactDOM.createRoot(container);

                // Render the Popup component and append it to the overlay
                const popup = (
                    <Popup
                        step={step}
                        totalSteps={totalSteps}
                        change={nextStep}
                        skip={onSkip}
                        close={onClose}
                    />
                );
                root.render(popup);
                popupRef.current = container;

                if (position === 'bottom-left') {
                    container.style.top = `${elementRect.bottom + 24}px`;
                    container.style.left = `${elementRect.left}px`;
                } else if (position === 'bottom-right') {
                    container.style.top = `${elementRect.bottom + 24}px`;
                    container.style.left = `${elementRect.right - 291}px`;
                } else if (position === 'right-top') {
                    container.style.top = `${elementRect.top}px`;
                    container.style.left = `${elementRect.right + 24}px`;
                }

                window.addEventListener('mousedown', handleClickOutside);

                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';

                // Clean up function to remove the overlay and popup when the component is unmounted
                return () => {
                    document.body.removeChild(container);
                    document.body.removeChild(overlay);
                    root.unmount();
                    window.removeEventListener('mousedown', handleClickOutside);
                    document.body.style.overflow = '';
                    document.documentElement.style.overflow = '';
                };
            }
        }
    }, [id, active]);

    return null;
};

export default Tutorial;
