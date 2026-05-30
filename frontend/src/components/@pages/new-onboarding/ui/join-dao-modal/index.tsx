import React from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import css from './join-dao-modal.module.scss';
import { useNavigate } from 'react-router-dom';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';

interface JoinDaoModalProps {
    onClose?: () => void;
}

export const JoinDaoModal: React.FC<JoinDaoModalProps> = ({ onClose }) => {
    const navigate = useNavigate();

    return (
        <Popup className={css.root} onClose={onClose}>
            <PopupTitle
                icon="/img/icons/magnifier.png"
                title={
                    <>
                        Join a <strong>DAO</strong>
                    </>
                }
            />

            <img className={css.skel_icon} src="/img/blog.svg" alt="icon" />

            <div className={css.text}>Join a DAO to explore Workspace on Samudai</div>

            <Button
                color="orange"
                className={css.button}
                onClick={() => {
                    navigate(`/discovery/dao`);
                    onClose?.();
                }}
            >
                Discover DAOs
            </Button>
        </Popup>
    );
};
