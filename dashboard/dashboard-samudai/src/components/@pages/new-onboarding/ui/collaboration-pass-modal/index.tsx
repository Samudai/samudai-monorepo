import React from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import css from './collaboration-pass-modal.module.scss';

interface CollaborationPassModalProps {
    onClose?: () => void;
}

export const CollaborationPassModal: React.FC<CollaborationPassModalProps> = ({ onClose }) => {
    return (
        <Popup className={css.root} onClose={onClose}>
            <h2 className={css.title}>
                <span>🎉</span>
                <span>Collaboration Pass Unlocked</span>
            </h2>

            <p className={css.text}>You can now collaborate with other DAOs on Samudai</p>

            <img
                src={'/img/onboarding/collaboration-pass.png'}
                alt="screen"
                className={css.screen_image}
            />

            <button className={css.button} onClick={() => {}}>
                Checkout Now!
            </button>
        </Popup>
    );
};
