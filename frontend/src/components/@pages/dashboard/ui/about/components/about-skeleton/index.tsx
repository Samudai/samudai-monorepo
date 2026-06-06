import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './about-skeleton.module.scss';

export const AboutSkeleton: React.FC = () => (
    <div>
        <Skeleton.Text className={styles.text} />
        <Skeleton.Text className={styles.text} />
        <Skeleton.Text className={styles.text} />
        <Skeleton.Text className={styles.text} />
        <Skeleton.Text className={styles.text} />
    </div>
);
