import React from 'react';
import Board from '../../board/board';
import Button from 'ui/@buttons/Button/Button';
import styles from './connect-apps.module.scss';

interface ConnectAppsProps {
    onClose: () => void;
}

const ConnectApps: React.FC<ConnectAppsProps> = ({ onClose }) => {
    return (
        <Board isModal title="Connect Apps" icon="/img/icons/apps.png" className={styles.apps}>
            <div className={styles.apps_list}>
                <button className={styles.apps_btn}>
                    <img
                        className={styles.apps_btn_img}
                        src="/img/icons/google-calendar.svg"
                        alt="discord"
                    />
                    <span className={styles.apps_btn_name}>Google Calendar</span>
                    <span className={styles.apps_btn_lbl}>Connect</span>
                </button>
                <button className={styles.apps_btn}>
                    <img
                        className={styles.apps_btn_img}
                        src="/img/icons/snapchat.svg"
                        alt="gnosis"
                    />
                    <span className={styles.apps_btn_name}>Snapchat</span>
                    <span className={styles.apps_btn_lbl}>Connect</span>
                </button>
                <button className={styles.apps_btn}>
                    <img
                        className={styles.apps_btn_img}
                        src="/img/icons/twitter.svg"
                        alt="gnosis"
                    />
                    <span className={styles.apps_btn_name}>Twitter</span>
                    <span className={styles.apps_btn_lbl}>Connect</span>
                </button>
            </div>
            <Button className={styles.apps_next} color="orange" onClick={onClose}>
                <span>Connect</span>
            </Button>
        </Board>
    );
};

export default ConnectApps;
