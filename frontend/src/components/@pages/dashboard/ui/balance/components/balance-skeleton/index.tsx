import React from 'react';
import Skeleton from 'components/Skeleton/Skeleton';
import styles from './balance-skeleton.module.scss';

export const BalanceSkeleton: React.FC = () => (
    <div className={styles.root}>
        <div className=" total-balance__sum">
            <h2 className="total-balance__sum-token">
                <Skeleton.Block className={styles.token} />
            </h2>
            <h3 className="total-balance__sum-dollar">
                <Skeleton.Title className={styles.sum} />
            </h3>
        </div>
        <Skeleton.Button className={styles.currency} />
    </div>
);
