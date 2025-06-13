import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './events-skeleton.module.scss';

export const EventsSkeleton: React.FC = () => (
    <React.Fragment>
        <Skeleton.Block className={styles.block} />
        <Skeleton.Block className={styles.block} />
        <Skeleton.Block className={styles.block} />
    </React.Fragment>
);
