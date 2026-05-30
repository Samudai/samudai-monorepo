import React from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import MarkIcon from 'ui/SVG/MarkIcon';
import styles from '../styles/job-submitted.module.scss';

interface JobSubmittedProps {
    isOpenToCaptain?: boolean;
    onClose: () => void;
}

const JobSubmitted: React.FC<JobSubmittedProps> = ({ onClose, isOpenToCaptain }) => {
    return (
        <Popup className={styles.submitted}>
            <PopupTitle icon="/img/icons/complete.png" title="Done" />
            <div className={styles.submitted_content}>
                <div className={styles.submitted_complete}>
                    <MarkIcon />
                </div>
                <p className={styles.submitted_text}>Job Posted!</p>
                {isOpenToCaptain && (
                    <p className={styles.submitted_text}>
                        Open to: <span>Captain</span>
                    </p>
                )}
            </div>
            <Button color="green" className={styles.submitted_btn} onClick={onClose}>
                <span>Close</span>
            </Button>
        </Popup>
    );
};

export default JobSubmitted;
