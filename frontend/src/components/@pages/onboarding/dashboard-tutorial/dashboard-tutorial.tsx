import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import Board from '../board/board';
import ConnectApps from './connect-apps/connect-apps';
import { getWidgetData } from './utils/dd';
import WidgetAdd from './widget-add/widget-add';
import clsx from 'clsx';
import Button from 'ui/@buttons/Button/Button';
import MoveHandIcon from 'ui/SVG/MoveHandIcon';
import styles from './dashboard-tutorial.module.scss';

interface DashboardTutorialProps {
    onBack: () => void;
    onNext: () => void;
}

interface DragItemData {
    column: string;
    index: number;
}

const DashboardTutorial: React.FC<DashboardTutorialProps> = ({ onBack, onNext }) => {
    const [widgets, setWidgets] = useState(getWidgetData());
    const [deactivated, setDeactivated] = useState<string[]>([]);
    const [isDraggable, setDraggable] = useState(false);
    const [dragItem, setDragItem] = useState<DragItemData | null>(null);
    const [showedApps, setShowedApps] = useState(false);
    const [activeApps, setActiveApps] = useState(false);
    const [step, setStep] = useState(1);

    const handleBack = () => {
        if (step === 2) setStep(1);
        else onBack();
    };

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else if (!showedApps) {
            setShowedApps(true);
            setActiveApps(true);
        } else {
            onNext();
        }
    };

    const handleSkip = () => {
        if (step === 2 && !showedApps) handleNext();
        else if (step === 2 && showedApps) onNext();
        else setStep(2);
    };

    const handleToggleWidget = (name: string) => {
        if (deactivated.includes(name)) {
            return setDeactivated(deactivated.filter((d) => d !== name));
        }
        setDeactivated([...deactivated, name]);
    };

    const handleDragStart = (ev: React.DragEvent<HTMLLIElement>, widget: DragItemData) => {
        setDragItem(widget);
        ev.currentTarget.style.opacity = '0.4';
    };

    const handleDragOver = (
        ev: React.DragEvent<HTMLLIElement>,
        widget: DragItemData,
        canDrop: boolean
    ) => {
        ev.preventDefault();
        if (dragItem?.index === widget.index && dragItem?.column === widget.column) return;

        const target = ev.target as HTMLLIElement;
        const overElement = target.closest('[data-draggable]');
        if (overElement && canDrop) {
            overElement.classList.add(styles.dashboard_widget_dragging);
        }
    };

    const handleDragLeave = (ev: React.DragEvent<HTMLLIElement>) => {
        const target = ev.target as HTMLDivElement;
        target.classList.remove(styles.dashboard_widget_dragging);
    };

    const handleDragEnd = (ev: React.DragEvent<HTMLLIElement>) => {
        ev.preventDefault();
        setDragItem(null);
        ev.currentTarget.style.opacity = '';
    };

    const handleDrop = (ev: React.DragEvent<HTMLLIElement>, widget: DragItemData) => {
        ev.preventDefault();
        if (dragItem) {
            const [sourceWidget] = widgets
                .find((w) => w.position === dragItem.column)!
                .widgets.splice(dragItem.index, 1);

            const [destWidget] = widgets
                .find((w) => w.position === widget.column)!
                .widgets.splice(widget.index, 1, sourceWidget);

            widgets
                .find((w) => w.position === dragItem.column)!
                .widgets.splice(dragItem.index, 0, destWidget);

            setWidgets([...widgets]);
        }
    };

    return (
        <Board
            className={clsx(styles.dashboard, activeApps && styles.dashboard_apps)}
            suptitle={`Step ${step}/2`}
            title={step === 1 ? 'Turn on/off widget' : 'Drag and move widget'}
            icon="/img/icons/eyes.png"
            onBack={handleBack}
        >
            <div className={styles.dashboard_inner}>
                {/* Bullets */}
                <ul className={styles.dashboard_bullets}>
                    {[1, 2].map((bul) => (
                        <li
                            className={clsx(
                                styles.dashboard_bullets_item,
                                bul === step && styles.dashboard_bullets_item_active
                            )}
                            key={bul}
                        ></li>
                    ))}
                </ul>
                {/* Toggler */}
                <div className={styles.dashboard_toggler}>
                    <WidgetAdd deactivated={deactivated} onToggleWidget={handleToggleWidget} />
                </div>
                {/* Workspace */}
                <div className={styles.dashboard_workspace}>
                    {widgets.map((column) => (
                        <ul className={styles.dashboard_col} key={column.position}>
                            {column.widgets.map((widget, index) => (
                                <CSSTransition
                                    key={widget.name}
                                    timeout={400}
                                    in={!deactivated.includes(widget.name)}
                                    classNames={styles}
                                    mountOnEnter
                                    unmountOnExit
                                >
                                    <li
                                        className={clsx(
                                            styles.dashboard_widget,
                                            isDraggable &&
                                                widget.draggable &&
                                                styles.dashboard_widget_active
                                        )}
                                        draggable={isDraggable && widget.draggable}
                                        onDragStart={(e) =>
                                            handleDragStart(e, { column: column.position, index })
                                        }
                                        onDragOver={(e) =>
                                            handleDragOver(
                                                e,
                                                { column: column.position, index },
                                                widget.draggable
                                            )
                                        }
                                        onDragEnd={(e) => handleDragEnd(e)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) =>
                                            handleDrop(e, { column: column.position, index })
                                        }
                                        data-draggable
                                        key={widget.name}
                                    >
                                        {widget.draggable && (
                                            <button
                                                className={styles.dashboard_widget_hand}
                                                onClick={setDraggable.bind(null, !isDraggable)}
                                            >
                                                <MoveHandIcon />
                                            </button>
                                        )}
                                        <widget.Widget
                                            key={widget.name}
                                            className={column.position}
                                        />
                                    </li>
                                </CSSTransition>
                            ))}
                        </ul>
                    ))}
                </div>
                {/* Controls */}
                <div className={styles.dashboard_controls}>
                    <Button
                        className={styles.dashboard_controls_btn}
                        onClick={handleSkip}
                        color="orange-outlined"
                    >
                        <span>Skip</span>
                    </Button>
                    <Button
                        className={styles.dashboard_controls_btn}
                        onClick={handleNext}
                        color="orange"
                    >
                        <span>Next</span>
                    </Button>
                </div>
            </div>
            {activeApps && <ConnectApps onClose={setActiveApps.bind(null, false)} />}
        </Board>
    );
};

export default DashboardTutorial;
