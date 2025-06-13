import React from 'react';
import css from './tutorial.module.scss';
import clsx from 'clsx';
import { TutorialStep } from './utils';

interface PopupProps {
    step: TutorialStep;
    totalSteps: number;
    change?: () => void;
    skip?: () => void;
    close: () => void;
}

const Popup: React.FC<PopupProps> = ({ step, totalSteps, change, skip, close }) => {
    return (
        <div className={css.popup}>
            <div className={css.popup_header}>
                <div className={css.popup_header_1}>{step.name}</div>
                {!!step.id && (
                    <div className={css.popup_header_2}>
                        {step.id}/{totalSteps}
                    </div>
                )}
            </div>
            <div className={css.popup_body}>{step.description}</div>
            <div className={css.popup_footer}>
                {step?.skip && (
                    <button onClick={skip} className={clsx(css.popup_button, css.popup_button_1)}>
                        {step?.action ? 'Do Later' : 'Skip Training'}
                    </button>
                )}
                <button
                    onClick={() => {
                        step?.action ? step.action.onClick() : change ? change() : close();
                    }}
                    className={clsx(css.popup_button, css.popup_button_2)}
                >
                    {step?.action ? step.action.name : change ? 'Next' : 'Ok, Got it'}
                </button>
            </div>
        </div>
    );
};

export default Popup;
