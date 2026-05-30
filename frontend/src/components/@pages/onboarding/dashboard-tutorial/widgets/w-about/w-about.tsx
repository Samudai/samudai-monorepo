import clsx from 'clsx';
import React from 'react';
import styles from './w-about.module.scss';

interface WAboutProps {
    className?: string;
}

const WAbout: React.FC<WAboutProps> = ({ className }) => {
    return (
        <div className={clsx(styles.about, styles[className || ''])} data-widget>
            <h3 className={styles.about_title}>About DAO</h3>
            <p className={styles.about_text}>
                I live in any area that drives experience — whether it’s initial exploration,
                critically refining user flows and functionality, or polishing the visuals. I help
                businesses develop their product and iterate quickly to deliver meaningful,
                successful results.
            </p>
        </div>
    );
};

export default WAbout;
