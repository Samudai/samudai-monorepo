import React from 'react';
import Button from 'ui/@buttons/Button/Button';
import Board from '../board/board';
import styles from './connect-apps.module.scss';

interface ConnectAppsProps {
    onBack: () => void;
    onNext: () => void;
}

const ConnectApps: React.FC<ConnectAppsProps> = ({ onBack, onNext }) => {
    return (
        <Board title="Connect to different Apps" icon="/img/icons/apps.png" onBack={onBack}>
            <div className={styles.connect}>
                <button className={styles.connect_btn}>
                    <img
                        className={styles.connect_btn_img}
                        src="/img/icons/discord.svg"
                        alt="discord"
                    />
                    <span className={styles.connect_btn_name}>Discord</span>
                    <span className={styles.connect_btn_lbl}>Connect</span>
                </button>
                <button className={styles.connect_btn}>
                    <img
                        className={styles.connect_btn_img}
                        src="/img/icons/gnosis.svg"
                        alt="gnosis"
                    />
                    <span className={styles.connect_btn_name}>Gnosis</span>
                    <span className={styles.connect_btn_lbl}>Connect</span>
                </button>
            </div>
            <Button className={styles.connect_next} color="orange" onClick={onNext}>
                <span>Connect</span>
            </Button>
        </Board>
    );
};

export default ConnectApps;
