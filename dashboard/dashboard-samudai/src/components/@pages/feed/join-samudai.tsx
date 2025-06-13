import React from 'react';
import styles from './styles/join-samudai.module.scss';

interface JoinSamudaiProps {}

const JoinSamudai: React.FC<JoinSamudaiProps> = (props) => {
    return (
        <div className={styles.js}>
            <h3 className={styles.js_title}>Join Samudai Today</h3>
            <button className={styles.js_join}>Join Samudai</button>
            <div className={styles.js_screen}>
                <img src="/img/join-screen.png" alt="join" />
            </div>
        </div>
    );
};

export default JoinSamudai;
